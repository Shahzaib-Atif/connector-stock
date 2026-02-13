import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateConnectorDto } from 'src/dtos/connector.dto';
import { WireTypes } from 'src/dtos/transaction.dto';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';

@Injectable()
export class ConnectorRepo {
  constructor(private prisma: PrismaService) {}

  async getConnectorTypes() {
    try {
      return await this.prisma.connectorTypes.findMany();
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getConnectors() {
    try {
      return await this.prisma.connectors_Main.findMany({
        include: {
          Connectors_Details: true,
          Connectors_Dimensions: {
            where: {
              InternalDiameter: { not: null },
            },
          },
        },
      });
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getConnectorByCodivmac(codivmac: string) {
    try {
      return await this.prisma.connectors_Main.findUnique({
        where: { CODIVMAC: codivmac },
        include: {
          Connectors_Details: true,
          Connectors_Dimensions: {
            where: {
              InternalDiameter: { not: null },
            },
          },
        },
      });
    } catch (ex: any) {
      console.error('Error fetching connector by codivmac:', ex.message);
      return undefined;
    }
  }

  async update(
    codivmacId: string,
    amount: number,
    subType?: WireTypes,
    tx?: TransactionClient,
  ) {
    try {
      const client = tx || this.prisma;
      const data: any = {
        Qty: { increment: amount },
      };

      if (subType === WireTypes.COM_FIO) {
        data.Qty_com_fio = { increment: amount };
      } else if (subType === WireTypes.SEM_FIO) {
        data.Qty_sem_fio = { increment: amount };
      }

      return await client.connectors_Main.update({
        where: {
          CODIVMAC: codivmacId,
        },
        data: data,
      });
    } catch (ex: any) {
      console.error(ex.message);
      return null;
    }
  }

  async adjustQuantity(
    tx: TransactionClient,
    codivmac: string,
    delta: number,
    subType?: WireTypes,
  ) {
    if (!codivmac || !delta) return;

    try {
      const data: any = { Qty: { increment: delta } };

      if (subType === WireTypes.COM_FIO) {
        data.Qty_com_fio = { increment: delta };
      } else if (subType === WireTypes.SEM_FIO) {
        data.Qty_sem_fio = { increment: delta };
      }

      await tx.connectors_Main.update({
        where: { CODIVMAC: codivmac },
        data: data,
      });
    } catch (err) {
      if (err.code === 'P2025') {
        // Record doesn't exist
        throw new NotFoundException(`Connector with ID ${codivmac} not found`);
      }
      throw err; // re-throw other errors
    }
  }

  async upsertReferenceMapping(
    tx: TransactionClient,
    amostra: string,
    refDescricao: string,
    currentUser: string,
  ) {
    // mapping: RefDIVMAC = Amostra, RefMARCA = Ref_Descricao
    await tx.$executeRaw`
      INSERT INTO ImageFeaturesDB.dbo.RefClientes_Marca (RefDIVMAC, RefMARCA, LastChangeBy, LastUpdateDate, createdByApp)
      SELECT ${amostra}, ${refDescricao}, ${currentUser}, GETDATE(), 1
      WHERE NOT EXISTS (
        SELECT 1 FROM ImageFeaturesDB.dbo.RefClientes_Marca 
        WHERE RefDIVMAC = ${amostra} AND RefMARCA = ${refDescricao} AND ESTADO = 1
      )
    `;
  }

  async updateConnectorProperties(codivmac: string, data: UpdateConnectorDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Update Main table
        await tx.connectors_Main.update({
          where: { CODIVMAC: codivmac },
          data: {
            Cor: data.Cor,
            Vias: data.Vias,
            ConnType: data.ConnType,
            Qty: data.Qty,
            Qty_com_fio: data.Qty_com_fio,
            Qty_sem_fio: data.Qty_sem_fio,
          },
        });

        // Update Details table (upsert just in case it's missing)
        await tx.connectors_Details.upsert({
          where: { ConnId: codivmac },
          create: {
            ConnId: codivmac,
            Fabricante: data.Fabricante,
            Family: data.Family,
            ActualViaCount: data.ActualViaCount,
          },
          update: {
            Fabricante: data.Fabricante,
            Family: data.Family,
            ActualViaCount: data.ActualViaCount,
          },
        });

        return true;
      });
    } catch (ex: any) {
      console.error('Error updating connector properties:', ex.message);
      throw ex;
    }
  }
}
