import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DBService {
  constructor(private prisma: PrismaService) {}

  async getCors() {
    try {
      return await this.prisma.cores.findMany();
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getVias() {
    try {
      return await this.prisma.contagemNumVias.findMany();
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getAccessoryTypes() {
    try {
      return await this.prisma.accessoryTypes.findMany();
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getConnectorTypes() {
    try {
      return await this.prisma.connectorTypes.findMany();
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getCord_CON() {
    try {
      return await this.prisma.$queryRaw`
      Select CON, CV, CH from Cord_CON 
      WHERE CV is not NULL and CH  is not NULL 
      `;
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async getReferencias() {
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

  async getAccessories() {
    try {
      return await this.prisma.rEG_AccessoriesSamples.findMany({
        select: {
          ConnName: true,
          AccessoryType: true,
          RefClient: true,
          Qty: true,
          CapotAngle: true,
          ClipColor: true,
        },
      });
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }
}
