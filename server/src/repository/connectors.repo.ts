import { Injectable } from '@nestjs/common';
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
}
