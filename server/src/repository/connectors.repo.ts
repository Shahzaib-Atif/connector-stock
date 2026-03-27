import { Connector } from '@domain/entities/Connector';
import { ConnectorMapper } from '@infra/ConnectorMapper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { WireTypes } from '@shared/enums/WireTypes';
import { getErrorMsg } from '@shared/utils/getErrorMsg';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateConnectorDto } from 'src/dtos/connector.dto';
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

  async getConnectors(): Promise<Connector[]> {
    try {
      const data = await this.prisma.connectors_Main.findMany({
        include: {
          Connectors_Details: true,
          Connectors_Dimensions: {
            where: {
              InternalDiameter: { not: null },
            },
          },
        },
      });
      if (!data) return [];

      // return data after converting to domain entity
      return data.map((c) => ConnectorMapper.toDomain(c));
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getRefClientes_Marca(): Promise<
    { RefDIVMAC: string; RefMARCA: string }[]
  > {
    try {
      // Fetch client references from legacy table
      return await (this.prisma as any).$queryRawUnsafe(`
        SELECT RefDIVMAC, RefMARCA 
        FROM ImageFeaturesDB.dbo.RefClientes_Marca 
        WHERE ESTADO = 1
      `);
    } catch (e) {
      console.error('Error fetching client mappings:', getErrorMsg(e));
      return [];
    }
  }

  async getConnectorByCodivmac(codivmac: string): Promise<Connector | null> {
    try {
      const data = await this.prisma.connectors_Main.findUnique({
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

      if (!data) return null;

      // return data after converting to domain entity
      return ConnectorMapper.toDomain(data);
    } catch (ex: any) {
      console.error('Error fetching connector by codivmac:', ex.message);
      return null;
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
      const data = this.incrementQty(amount, subType);

      return await client.connectors_Main.update({
        where: {
          CODIVMAC: codivmacId,
        },
        data,
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
      const data = this.incrementQty(delta, subType);

      await tx.connectors_Main.update({
        where: { CODIVMAC: codivmac },
        data,
      });
    } catch (err: unknown) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
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
            Refabricante: data.Refabricante,
            Family: data.Family,
            ActualViaCount: data.ActualViaCount,
          },
        });

        // Update Dimensions table (upsert when dimensions are provided)
        if (data.dimensions) {
          await tx.connectors_Dimensions.upsert({
            where: { ConnId: codivmac },
            create: {
              ConnId: codivmac,
              InternalDiameter: data.dimensions.InternalDiameter,
              ExternalDiameter: data.dimensions.ExternalDiameter,
              Thickness: data.dimensions.Thickness,
            },
            update: {
              InternalDiameter: data.dimensions.InternalDiameter,
              ExternalDiameter: data.dimensions.ExternalDiameter,
              Thickness: data.dimensions.Thickness,
            },
          });
        }

        return true;
      });
    } catch (ex: any) {
      console.error('Error updating connector properties:', ex.message);
      throw ex;
    }
  }

  private incrementQty(amount: number, subType?: WireTypes) {
    return {
      Qty: { increment: amount },
      ...(subType === WireTypes.COM_FIO && {
        Qty_com_fio: { increment: amount },
      }),
      ...(subType === WireTypes.SEM_FIO && {
        Qty_sem_fio: { increment: amount },
      }),
    };
  }
}
