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
      return await this.prisma.referencias_test.findMany({
        select: {
          Pos_ID: true,
          Cor: true,
          Vias: true,
          CODIVMAC: true,
          ConnType: true,
          Fabricante: true,
          Refabricante: true,
        },
      });
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }
}
