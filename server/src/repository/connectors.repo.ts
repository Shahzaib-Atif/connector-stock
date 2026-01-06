import { Injectable } from '@nestjs/common';
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

  async getConnectors() {
    try {
      return await this.prisma.connectors_Main.findMany({
        select: {
          PosId: true,
          Cor: true,
          Vias: true,
          CODIVMAC: true,
          ConnType: true,
          Qty: true,
          Connectors_Details: {
            select: {
              Fabricante: true,
              Refabricante: true,
              Family: true,
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
        select: {
          PosId: true,
          Cor: true,
          Vias: true,
          CODIVMAC: true,
          ConnType: true,
          Qty: true,
          Imagem: true,
          Connectors_Details: {
            select: {
              Designa__o: true,
              Fabricante: true,
              Refabricante: true,
              Family: true,
              OBS: true,
            },
          },
        },
      });
    } catch (ex: any) {
      console.error('Error fetching connector by codivmac:', ex.message);
      return null;
    }
  }

  async update(codivmacId: string, amount: number) {
    try {
      return await this.prisma.connectors_Main.update({
        where: {
          CODIVMAC: codivmacId,
        },
        data: {
          Qty: { increment: amount },
        },
      });
    } catch (ex: any) {
      console.error(ex.message);
      return null;
    }
  }

  async adjustQuantity(tx: TransactionClient, codivmac: string, delta: number) {
    if (!codivmac || !delta) return;

    await tx.connectors_Main.update({
      where: { CODIVMAC: codivmac },
      data: { Qty: { increment: delta } },
    });
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
          },
        });

        // Update Details table (upsert just in case it's missing)
        await tx.connectors_Details.upsert({
          where: { ConnId: codivmac },
          create: {
            ConnId: codivmac,
            Fabricante: data.Fabricante,
            Family: data.Family,
          },
          update: {
            Fabricante: data.Fabricante,
            Family: data.Family,
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
