import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';
import { SamplesRepo } from 'src/repository/samples.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { AccessoryRepo } from 'src/repository/accessories.repo';
import { CreateSampleDto, UpdateSampleDto } from 'src/dtos/samples.dto';
import { TransactionsService } from './transactions.service';

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

      // 2. Process Stock Transactions (if quantity > 0)
      const quantity = this.parseQuantity(dto.Quantidade);
      if (quantity > 0) {
        // Connector Transaction (IN)
        const connectorId = this.getConnectorId(dto.Amostra);
        if (connectorId) {
          await this.transactionsService.processTransaction(
            {
              itemId: connectorId,
              transactionType: 'IN',
              amount: quantity,
              itemType: 'connector',
              department: dto.Entregue_a,
            },
            tx,
          );
        }

        // Accessories Transactions (IN)
        if (associatedItemIds && associatedItemIds.length > 0) {
          for (const accId of associatedItemIds) {
            await this.transactionsService.processTransaction(
              {
                itemId: accId,
                transactionType: 'IN',
                amount: quantity,
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
      const targetConnId = this.getConnectorId(targetAmostra);
      const existingConnId = this.getConnectorId(existing.Amostra);

      // Adjust connector quantity
      if (delta !== 0 || targetConnId !== existingConnId) {
        if (targetConnId !== existingConnId) {
          // Revert old (OUT)
          if (previousQty > 0) {
            await this.transactionsService.processTransaction(
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
          // Add new (IN)
          if (newQty > 0) {
            await this.transactionsService.processTransaction(
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
        } else {
          // Same connector, adjust by delta
          const type = delta > 0 ? 'IN' : 'OUT';
          await this.transactionsService.processTransaction(
            {
              itemId: targetConnId,
              transactionType: type,
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
      const qty = this.parseQuantity(existing.Quantidade);
      if (qty > 0) {
        const connId = this.getConnectorId(existing.Amostra);

        // Revert Connector
        await this.transactionsService.processTransaction(
          {
            itemId: connId,
            transactionType: 'OUT',
            amount: qty,
            itemType: 'connector',
            department: existing.Entregue_a,
          },
          tx,
        );

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

  private getConnectorId(amostra: string): string {
    if (!amostra) return '';

    const cleanAmostra = amostra.trim();

    if (cleanAmostra.includes('+')) {
      const partBeforePlus = cleanAmostra.split('+')[0].trim();
      // Return first 6 characters as requested
      return partBeforePlus.substring(0, 6);
    }

    return cleanAmostra;
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
