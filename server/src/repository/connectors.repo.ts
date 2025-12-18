import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

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
}
