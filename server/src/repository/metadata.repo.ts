import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MetadataRepo {
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

  async getFabricante() {
    //Fabricante
    try {
      return await this.prisma.$queryRaw`
      Select Fabricante from Fabricantes 
      WHERE Fabricante is not NULL 
      `;
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }
}
