import { Connector } from '@domain/entities/Connector';
import { ConnectorMapper } from '@infra/ConnectorMapper';
import { Injectable } from '@nestjs/common';
import { CreateConnectorDto } from '@shared/dto/ConnectorDto';
import { ConnectorDto } from '@shared/dto/ConnectorDto';
import { WireTypes } from '@shared/enums/WireTypes';
import { getErrorMsg } from '@shared/utils/getErrorMsg';
import { PrismaService } from 'prisma/prisma.service';
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

  async getConnectorByCodivmac(
    codivmac: string,
    tx?: TransactionClient,
  ): Promise<ConnectorDto | null> {
    try {
      const client = tx || this.prisma;
      const data = await client.connectors_Main.findUnique({
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
      return ConnectorMapper.prismaToDto(data);
    } catch (ex: any) {
      console.error('Error fetching connector by codivmac:', ex.message);
      return null;
    }
  }

  async createConnector(
    codivmac: string,
    dto: CreateConnectorDto,
  ): Promise<ConnectorDto | null> {
    return await this.prisma.$transaction(async (tx) => {
      await tx.connectors_Main.create({
        data: {
          PosId: dto.PosId,
          Cor: dto.Cor,
          Vias: dto.Vias,
          CODIVMAC: codivmac,
          Qty: dto.Qty,
          Qty_com_fio: dto.Qty_com_fio,
          Qty_sem_fio: dto.Qty_sem_fio,
          ConnType: dto.ConnType,
          LastChangeBy: dto.LastChangeBy,
          LastUpdateDate: new Date(),
        },
      });

      await tx.connectors_Details.create({
        data: {
          ConnId: codivmac,
          Fabricante: dto.details?.Fabricante,
          Refabricante: dto.details?.Refabricante,
          Family: dto.details?.Family,
          ActualViaCount: dto.details?.ActualViaCount,
        },
      });

      if (this.hasDimensions(dto.dimensions)) {
        await tx.connectors_Dimensions.create({
          data: {
            ConnId: codivmac,
            InternalDiameter: dto.dimensions?.InternalDiameter,
            ExternalDiameter: dto.dimensions?.ExternalDiameter,
            Thickness: dto.dimensions?.Thickness,
          },
        });
      }

      return (await this.getConnectorByCodivmac(codivmac, tx)) ?? null;
    });
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

      const result = await client.connectors_Main.updateMany({
        where: {
          CODIVMAC: codivmacId,
        },
        data,
      });
      if (result.count === 0)
        console.warn(`No record found when updating codivmacId: ${codivmacId}`);
    } catch (ex: unknown) {
      getErrorMsg(ex);
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
    data: ConnectorDto,
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

  async updateConnectorStock(
    codivmac: string,
    Qty: number,
    Qty_com_fio: number,
    Qty_sem_fio: number,
    LastChangeBy: string,
    tx?: TransactionClient,
  ) {
    const client = tx || this.prisma;
    await client.connectors_Main.update({
      where: { CODIVMAC: codivmac },
      data: {
        Qty,
        Qty_com_fio,
        Qty_sem_fio,
        LastChangeBy,
        LastUpdateDate: new Date(),
      },
    });
  }

  // update connectors_Main
  private async updateMain(
    codivmac: string,
    data: ConnectorDto,
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
    data: ConnectorDto,
    tx?: TransactionClient,
  ): Promise<void> {
    try {
      const client = tx || this.prisma;
      await client.connectors_Details.upsert({
        where: { ConnId: codivmac },
        create: {
          ConnId: codivmac,
          Fabricante: data.details?.Fabricante,
          Family: data.details?.Family,
          ActualViaCount: data.details?.ActualViaCount,
        },
        update: {
          Fabricante: data.details?.Fabricante,
          Refabricante: data.details?.Refabricante,
          Family: data.details?.Family,
          ActualViaCount: data.details?.ActualViaCount,
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
    data: ConnectorDto,
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

  private hasDimensions(
    dimensions?: CreateConnectorDto['dimensions'],
  ): boolean {
    return !!(
      dimensions &&
      (dimensions.InternalDiameter != null ||
        dimensions.ExternalDiameter != null ||
        dimensions.Thickness != null)
    );
  }
}
