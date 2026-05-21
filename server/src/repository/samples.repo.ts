import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SamplesDto, CreateSamplesDto } from '@shared/dto/SamplesDto';
import { RegAmostrasOrcDto } from '@shared/dto/RegAmostrasOrcDto';
import { RegAmostrasEncDto } from '@shared/dto/RegAmostrasEncDto';
import { AnaliseTabDto } from '@shared/dto/AnaliseTabDto';

@Injectable()
export class SamplesRepo {
  constructor(private prisma: PrismaService) {}

  // Loads all active REG_Amostras rows from Prisma.
  async getAllSamples(): Promise<SamplesDto[]> {
    try {
      return await this.prisma.rEG_Amostras.findMany({
        where: { IsActive: true },
        orderBy: { ID: 'desc' },
      });
    } catch (ex: any) {
      console.error('Failed to get samples:', ex.message);
      return [];
    }
  }

  // Loads one REG_Amostras row by primary key.
  async getSampleById(id: number): Promise<SamplesDto | null> {
    try {
      return await this.prisma.rEG_Amostras.findUnique({
        where: { ID: id },
      });
    } catch (ex: any) {
      console.error('Failed to get sample:', ex.message);
      return null;
    }
  }

  // Inserts a new REG_Amostras row in the database.
  async createSample(dto: CreateSamplesDto): Promise<SamplesDto | null> {
    // Defensively strip identity/generated fields if the client sends them anyway.
    const {
      associatedItemIds,
      ID,
      IsActive,
      DateOfCreation,
      DateOfLastUpdate,
      ...sampleData
    } = dto as CreateSamplesDto &
      Partial<
        Pick<
          SamplesDto,
          'ID' | 'IsActive' | 'DateOfCreation' | 'DateOfLastUpdate'
        >
      >;

    try {
      return await this.prisma.rEG_Amostras.create({
        data: {
          ...sampleData,
          IsActive: true,
          DateOfCreation: new Date(),
        },
      });
    } catch (ex: any) {
      console.error('Failed to create sample:', ex.message);
      return null;
    }
  }

  // Updates an existing REG_Amostras row by id.
  async updateSample(
    id: number,
    dto: CreateSamplesDto,
  ): Promise<SamplesDto | null> {
    try {
      // Remove associatedItemIds from dto before creating prisma record
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { associatedItemIds, ...sampleData } = dto;
      return await this.prisma.rEG_Amostras.update({
        where: { ID: id },
        data: {
          ...sampleData,
          DateOfLastUpdate: new Date().toISOString(),
        },
      });
    } catch (ex: unknown) {
      console.error(
        ex instanceof Error ? ex.message : 'Unable to update sample',
      );
      return null;
    }
  }

  // Soft-deletes sample by setting IsActive false.
  async deleteSample(
    id: number,
    deletedBy?: string,
  ): Promise<SamplesDto | null> {
    try {
      return await this.prisma.rEG_Amostras.update({
        where: { ID: id },
        data: {
          IsActive: false,
          LasUpdateBy: deletedBy,
          DateOfLastUpdate: new Date().toISOString(),
        },
      });
    } catch (ex: any) {
      console.error('Failed to delete sample:', ex.message);
      return null;
    }
  }

  // Loads all V_AnaliseTab rows for cache refresh.
  async getAnaliseTab(): Promise<AnaliseTabDto[]> {
    try {
      return await this.prisma.v_AnaliseTab.findMany({
        orderBy: { DataAbertura: 'desc' },
      });
    } catch (ex: any) {
      console.error('Failed to get AnaliseTab data:', ex.message);
      return [];
    }
  }

  // Loads analise rows filtered by RefCliente substring.
  async getAnaliseTabByRefCliente(
    refCliente: string,
  ): Promise<AnaliseTabDto[]> {
    try {
      return await this.prisma.v_AnaliseTab.findMany({
        where: { RefCliente: { contains: refCliente } },
        distinct: ['Encomenda', 'Conector', 'Cliente', 'RefCliente'],
        orderBy: { DataAbertura: 'desc' },
      });
    } catch (ex: any) {
      console.error('Failed to get AnaliseTab data:', ex.message);
      return [];
    }
  }

  // Loads RegAmostrasEnc rows for wizard step three.
  async getRegAmostrasEnc(
    refCliente: string,
    projeto: string,
    conectorDV: string,
  ): Promise<RegAmostrasEncDto[]> {
    try {
      return await this.prisma.v_RegAmostrasEnc.findMany({
        where: {
          CDU_ModuloRefCliente: { contains: refCliente },
          cdu_projeto: { contains: projeto },
          CDU_ModuloRefConetorDV: { contains: conectorDV },
        },
      });
    } catch (ex: any) {
      console.error('Failed to get RegAmostrasEnc data:', ex.message);
      return [];
    }
  }

  // Loads ORC sample rows for one document or reference.
  async getSamplesFromORC(numorc: string): Promise<RegAmostrasOrcDto[]> {
    const byOrc = await this.prisma.v_RegAmostrasFromORC.findMany({
      where: { orcDoc: numorc },
    });

    if (byOrc.length) return byOrc;

    return this.prisma.v_RegAmostrasFromORC.findMany({
      where: {
        CDU_ModuloRefCliente: { startsWith: numorc },
      },
    });
  }

  // Loads every V_RegAmostrasFromORC row for caching.
  async getAllSamplesFromORC(): Promise<RegAmostrasOrcDto[]> {
    try {
      return await this.prisma.v_RegAmostrasFromORC.findMany();
    } catch (ex: any) {
      console.error('Failed to get all samples from ORC:', ex.message);
      return [];
    }
  }
}
