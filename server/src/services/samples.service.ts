import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';
import { SamplesRepo } from 'src/repository/samples.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { AccessoryRepo } from 'src/repository/accessories.repo';
import { CreateSampleDto, UpdateSampleDto } from 'src/dtos/samples.dto';
import { TransactionsService } from './transactions.service';
import { getConnectorId } from 'src/utils/getConnectorId';

@Injectable()
export class SamplesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly samplesRepo: SamplesRepo,
    private readonly connectorRepo: ConnectorRepo,
    private readonly accessoryRepo: AccessoryRepo,
    private readonly transactionsService: TransactionsService,
  ) {}

  /** Get all samples with unique projects and clients */
  async getAllSamples() {
    const samples = await this.samplesRepo.getAllSamples();
    // create a unique array of projects from samples
    const projects = new Set(samples.map((s) => s.Projeto).filter(Boolean));
    const clients = new Set(samples.map((s) => s.Cliente).filter(Boolean));

    return {
      samples,
      projects: Array.from(projects),
      clients: Array.from(clients),
    };
  }

  async getSampleById(id: number) {
    return this.samplesRepo.getSampleById(id);
  }

  /** Get AnaliseTab data by RefCliente for multi-step sample creation */
  getAnaliseTabByRefCliente(refCliente: string) {
    return this.samplesRepo.getAnaliseTabByRefCliente(refCliente);
  }

  /** Get RegAmostrasEnc data with filters for multi-step sample creation */
  getRegAmostrasEnc(refCliente: string, projeto: string, conectorDV: string) {
    return this.samplesRepo.getRegAmostrasEnc(refCliente, projeto, conectorDV);
  }

  /** Get samples starting from ORC documents */
  getSamplesFromORC(numorc: string) {
    return this.samplesRepo.getSamplesFromORC(numorc);
  }

  // Create sample and process transactions atomically
  async createSample(dto: CreateSampleDto) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Create sample metadata
      // Remove associatedItemIds from dto before creating prisma record
      const { associatedItemIds, ...sampleData } = dto;

      const created = await tx.rEG_Amostras.create({
        data: {
          ...sampleData,
          IsActive: true,
          DateOfCreation: new Date(),
        },
      });

      // 2. Process Stock Transactions
      const qtyComFio = dto.qty_com_fio || 0;
      const qtySemFio = dto.qty_sem_fio || 0;
      const totalQuantity = this.parseQuantity(dto.Quantidade);

      if (qtyComFio > 0 || qtySemFio > 0 || totalQuantity > 0) {
        const connectorId = getConnectorId(dto.Amostra);
        if (connectorId) {
          // Process COM FIO
          if (qtyComFio > 0) {
            try {
              await this.transactionsService.processTransaction(
                {
                  itemId: connectorId,
                  transactionType: 'IN',
                  amount: qtyComFio,
                  itemType: 'connector',
                  subType: 'COM_FIO',
                  department: dto.Entregue_a,
                },
                tx,
              );
            } catch (e) {
              console.error('Failed to log COM_FIO transaction:', e.message);
            }
          }
          // Process SEM FIO
          if (qtySemFio > 0) {
            try {
              await this.transactionsService.processTransaction(
                {
                  itemId: connectorId,
                  transactionType: 'IN',
                  amount: qtySemFio,
                  itemType: 'connector',
                  subType: 'SEM_FIO',
                  department: dto.Entregue_a,
                },
                tx,
              );
            } catch (e) {
              console.error('Failed to log SEM_FIO transaction:', e.message);
            }
          }
          // Fallback if only total quantity is provided
          if (qtyComFio === 0 && qtySemFio === 0 && totalQuantity > 0) {
            try {
              await this.transactionsService.processTransaction(
                {
                  itemId: connectorId,
                  transactionType: 'IN',
                  amount: totalQuantity,
                  itemType: 'connector',
                  department: dto.Entregue_a,
                },
                tx,
              );
            } catch (e) {
              console.error(
                'Failed to log total quantity transaction:',
                e.message,
              );
            }
          }
        }

        // Accessories Transactions (IN) - use total quantity
        if (associatedItemIds && associatedItemIds.length > 0) {
          const accAmount = qtyComFio + qtySemFio || totalQuantity;
          for (const accId of associatedItemIds) {
            await this.transactionsService.processTransaction(
              {
                itemId: accId,
                transactionType: 'IN',
                amount: accAmount,
                itemType: 'accessory',
                department: dto.Entregue_a,
              },
              tx,
            );
          }
        }
      }

      // 3. Upsert reference mapping
      await this.upsertReferenceMapping(
        tx,
        dto.Amostra,
        dto.Ref_Descricao,
        dto.CreatedBy,
        dto.Data_recepcao,
        dto.Entregue_a,
        dto.N_Envio,
      );

      return created;
    });
  }

  // Update sample and adjust quantities atomically
  async updateSample(id: number, dto: UpdateSampleDto) {
    // Remove associatedItemIds from dto before creating prisma record
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { associatedItemIds, ...sampleData } = dto;

    // 1. Create sample metadata
    return await this.prisma.$transaction(async (tx) => {
      // Fetch existing sample

      const existing = await tx.rEG_Amostras.findUnique({
        where: { ID: id },
      });

      if (!existing) {
        throw new Error(`Sample with ID ${id} not found`);
      }

      // Update sample record

      const updated = await tx.rEG_Amostras.update({
        where: { ID: id },
        data: {
          ...sampleData,
          DateOfLastUpdate: new Date().toISOString(),
          LasUpdateBy: dto.LasUpdateBy,
        },
      });

      // Calculate quantity difference
      const previousQty = this.parseQuantity(existing.Quantidade);
      const newQty = this.parseQuantity(dto.Quantidade ?? existing.Quantidade);
      const delta = newQty - previousQty;

      const targetAmostra = dto.Amostra ?? existing.Amostra;
      const targetConnId = getConnectorId(targetAmostra);
      const existingConnId = getConnectorId(existing.Amostra);

      // Adjust connector quantity
      const prevQtyComFio = existing.qty_com_fio || 0;
      const prevQtySemFio = existing.qty_sem_fio || 0;
      const newQtyComFio = dto.qty_com_fio ?? prevQtyComFio;
      const newQtySemFio = dto.qty_sem_fio ?? prevQtySemFio;

      if (targetConnId !== existingConnId) {
        // Revert old
        if (existingConnId) {
          if (prevQtyComFio > 0) {
            await this.safeProcessTransaction(
              {
                itemId: existingConnId,
                transactionType: 'OUT',
                amount: prevQtyComFio,
                itemType: 'connector',
                subType: 'COM_FIO',
                department: existing.Entregue_a,
              },
              tx,
            );
          }
          if (prevQtySemFio > 0) {
            await this.safeProcessTransaction(
              {
                itemId: existingConnId,
                transactionType: 'OUT',
                amount: prevQtySemFio,
                itemType: 'connector',
                subType: 'SEM_FIO',
                department: existing.Entregue_a,
              },
              tx,
            );
          }
          if (prevQtyComFio === 0 && prevQtySemFio === 0 && previousQty > 0) {
            await this.safeProcessTransaction(
              {
                itemId: existingConnId,
                transactionType: 'OUT',
                amount: previousQty,
                itemType: 'connector',
                department: existing.Entregue_a,
              },
              tx,
            );
          }
        }
        // Add new
        if (targetConnId) {
          if (newQtyComFio > 0) {
            await this.safeProcessTransaction(
              {
                itemId: targetConnId,
                transactionType: 'IN',
                amount: newQtyComFio,
                itemType: 'connector',
                subType: 'COM_FIO',
                department: dto.Entregue_a ?? existing.Entregue_a,
              },
              tx,
            );
          }
          if (newQtySemFio > 0) {
            await this.safeProcessTransaction(
              {
                itemId: targetConnId,
                transactionType: 'IN',
                amount: newQtySemFio,
                itemType: 'connector',
                subType: 'SEM_FIO',
                department: dto.Entregue_a ?? existing.Entregue_a,
              },
              tx,
            );
          }
          if (newQtyComFio === 0 && newQtySemFio === 0 && newQty > 0) {
            await this.safeProcessTransaction(
              {
                itemId: targetConnId,
                transactionType: 'IN',
                amount: newQty,
                itemType: 'connector',
                department: dto.Entregue_a ?? existing.Entregue_a,
              },
              tx,
            );
          }
        }
      } else if (targetConnId) {
        // Adjust delta for same connector
        const deltaComFio = newQtyComFio - prevQtyComFio;
        const deltaSemFio = newQtySemFio - prevQtySemFio;

        if (deltaComFio !== 0) {
          await this.safeProcessTransaction(
            {
              itemId: targetConnId,
              transactionType: deltaComFio > 0 ? 'IN' : 'OUT',
              amount: Math.abs(deltaComFio),
              itemType: 'connector',
              subType: 'COM_FIO',
              department: dto.Entregue_a ?? existing.Entregue_a,
            },
            tx,
          );
        }
        if (deltaSemFio !== 0) {
          await this.safeProcessTransaction(
            {
              itemId: targetConnId,
              transactionType: deltaSemFio > 0 ? 'IN' : 'OUT',
              amount: Math.abs(deltaSemFio),
              itemType: 'connector',
              subType: 'SEM_FIO',
              department: dto.Entregue_a ?? existing.Entregue_a,
            },
            tx,
          );
        }
        // Fallback for total delta if sub-quantities are not used
        if (delta !== 0 && deltaComFio === 0 && deltaSemFio === 0) {
          await this.safeProcessTransaction(
            {
              itemId: targetConnId,
              transactionType: delta > 0 ? 'IN' : 'OUT',
              amount: Math.abs(delta),
              itemType: 'connector',
              department: dto.Entregue_a ?? existing.Entregue_a,
            },
            tx,
          );
        }
      }

      // Handle accessories on update
      // Logic: apply DELTA to newly provided accessories list.
      if (dto.associatedItemIds && dto.associatedItemIds.length > 0) {
        // If connector changed, we treat it as new addition (newQty), else delta
        const accDelta = targetConnId !== existingConnId ? newQty : delta;

        if (accDelta !== 0) {
          const type = accDelta > 0 ? 'IN' : 'OUT';
          for (const accId of dto.associatedItemIds) {
            await this.transactionsService.processTransaction(
              {
                itemId: accId,
                transactionType: type,
                amount: Math.abs(accDelta),
                itemType: 'accessory',
                department: dto.Entregue_a ?? existing.Entregue_a,
              },
              tx,
            );
          }
        }
      }

      // Upsert reference mapping
      await this.upsertReferenceMapping(
        tx,
        targetAmostra,
        dto.Ref_Descricao ?? existing.Ref_Descricao,
        dto.LasUpdateBy,
        dto.Data_recepcao ?? existing.Data_recepcao,
        dto.Entregue_a ?? existing.Entregue_a,
        dto.N_Envio ?? existing.N_Envio,
      );

      return updated;
    });
  }

  // Soft delete sample and revert all stock atomically
  async deleteSample(id: number, deletedBy?: string) {
    return await this.prisma.$transaction(async (tx) => {
      const existing = await tx.rEG_Amostras.findUnique({
        where: { ID: id },
      });

      if (!existing) {
        throw new Error(`Sample with ID ${id} not found`);
      }

      // Revert stock (OUT)
      const qty = this.parseQuantity(existing?.Quantidade);
      if (qty > 0) {
        const connId = getConnectorId(existing?.Amostra);

        // Revert Connector
        if (connId) {
          const qtyComFio = existing.qty_com_fio || 0;
          const qtySemFio = existing.qty_sem_fio || 0;

          if (qtyComFio > 0) {
            await this.safeProcessTransaction(
              {
                itemId: connId,
                transactionType: 'OUT',
                amount: qtyComFio,
                itemType: 'connector',
                subType: 'COM_FIO',
                department: existing.Entregue_a,
              },
              tx,
            );
          }
          if (qtySemFio > 0) {
            await this.safeProcessTransaction(
              {
                itemId: connId,
                transactionType: 'OUT',
                amount: qtySemFio,
                itemType: 'connector',
                subType: 'SEM_FIO',
                department: existing.Entregue_a,
              },
              tx,
            );
          }
          if (qtyComFio === 0 && qtySemFio === 0 && qty > 0) {
            await this.safeProcessTransaction(
              {
                itemId: connId,
                transactionType: 'OUT',
                amount: qty,
                itemType: 'connector',
                department: existing.Entregue_a,
              },
              tx,
            );
          }
        }

        // Revert dynamically associated accessories
        const associatedAccessories = await tx.rEG_AccessoriesSamples.findMany({
          where: { ConnName: connId },
        });

        if (associatedAccessories.length > 0) {
          for (const acc of associatedAccessories) {
            // Extract the simple ID
            const simpleId = acc.AccImagePath.split('.')[0];

            await this.transactionsService.processTransaction(
              {
                itemId: simpleId,
                transactionType: 'OUT',
                amount: qty,
                itemType: 'accessory',

                department: existing.Entregue_a,
              },
              tx,
            );
          }
        }
      }

      return await tx.rEG_Amostras.update({
        where: { ID: id },
        data: {
          IsActive: false,
          LasUpdateBy: deletedBy,
          DateOfLastUpdate: new Date().toISOString(),
        },
      });
    });
  }

  //#region -- Private Helpers

  private parseQuantity(qty?: string | null): number {
    const parsed = Number(qty);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private async safeProcessTransaction(dto: any, tx: TransactionClient) {
    try {
      await this.transactionsService.processTransaction(dto, tx);
    } catch (e: any) {
      console.error(
        `Failed to process transaction for ${dto.itemId}:`,
        e.message,
      );
    }
  }

  private async upsertReferenceMapping(
    tx: TransactionClient,
    amostra?: string | null,
    refDescricao?: string | null,
    user?: string | null,
    dataRecepcao?: string | null,
    entregueA?: string | null,
    nEnvio?: string | null,
  ) {
    if (
      !amostra ||
      amostra.toUpperCase().includes('NEW') ||
      !refDescricao ||
      !dataRecepcao ||
      !entregueA ||
      !nEnvio
    ) {
      return;
    }

    const currentUser = user || 'system';

    try {
      // Perform upsert operation for reference mapping
      await this.connectorRepo.upsertReferenceMapping(
        tx,
        amostra,
        refDescricao,
        currentUser,
      );
    } catch (error) {
      console.error('Error upserting reference mapping:', error.message);
      // We log but don't necessarily want to fail the main sample update if mapping fails
    }
  }
  //#endregion
}
