import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LegacyRepo {
  constructor(private prisma: PrismaService) {}

  async getBackupData() {
    try {
      return await this.prisma.refer_ncias_bk.findMany({
        select: {
          Pos_ID: true,
          Cor: true,
          Vias: true,
          CODIVMAC: true,
          Designa__o: true,
          Fabricante: true,
          Refabricante: true,
          Registo: true,
          OBS: true,
          LastChangeBy: true,
          LastUpdateDate: true,
          ESTADO: true,
          SampleType: true,
          ConnType: true,
        },
        orderBy: {
          LastUpdateDate: 'desc',
        },
      });
    } catch (ex: any) {
      console.error('Error fetching legacy backup data:', ex.message);
      return [];
    }
  }
}
