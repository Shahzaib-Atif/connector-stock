import { Connector } from '@domain/entities/Connector';
import { ConnectorMapper } from '@infra/ConnectorMapper';
import { Injectable } from '@nestjs/common';
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

  async updateQty(
    codivmacId: string,
    amount: number,
    subType?: WireTypes,
    tx?: TransactionClient,
  ) {
    try {
      const client = tx || this.prisma;
      const data = this.incrementQty(amount, subType);

      await client.connectors_Main.update({
        where: {
          CODIVMAC: codivmacId,
        },
        data,
      });
    } catch (ex: any) {
      console.error(ex.message);
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

  async updateConnectorProperties(
    codivmac: string,
    data: UpdateConnectorDto,
  ): Promise<boolean> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Update Main table
        await this.updateMain(codivmac, data, tx);

        // Update Details table (upsert just in case it's missing)
        await this.updateDetails(codivmac, data, tx);

        // Update Dimensions table (upsert when dimensions are provided)
        await this.updateDimensions(codivmac, data, tx);

        return true;
      });
    } catch (ex: any) {
      console.error('Error updating connector properties:', ex.message);
      throw ex;
    }
  }

  // update connectors_Main
  private async updateMain(
    codivmac: string,
    data: UpdateConnectorDto,
    tx?: TransactionClient,
  ): Promise<void> {
    try {
      const client = tx || this.prisma;
      await client.connectors_Main.update({
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
    } catch (ex: unknown) {
      console.error(getErrorMsg(ex));
      throw ex;
    }
  }

  // update connectors_Details
  private async updateDetails(
    codivmac: string,
    data: UpdateConnectorDto,
    tx?: TransactionClient,
  ): Promise<void> {
    try {
      const client = tx || this.prisma;
      await client.connectors_Details.upsert({
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
    } catch (ex: unknown) {
      console.error(getErrorMsg(ex));
      throw ex;
    }
  }

  // update connectors_Dimensions
  private async updateDimensions(
    codivmac: string,
    data: UpdateConnectorDto,
    tx?: TransactionClient,
  ): Promise<void> {
    try {
      const client = tx || this.prisma;
      if (data.dimensions) {
        await client.connectors_Dimensions.upsert({
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
    } catch (ex: unknown) {
      console.error(getErrorMsg(ex));
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
