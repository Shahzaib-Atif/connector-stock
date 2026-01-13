import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSampleDto, UpdateSampleDto } from 'src/dtos/samples.dto';

@Injectable()
export class SamplesRepo {
  constructor(private prisma: PrismaService) {}

  async getAllSamples() {
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

  async getSampleById(id: number) {
    try {
      return await this.prisma.rEG_Amostras.findUnique({
        where: { ID: id },
      });
    } catch (ex: any) {
      console.error('Failed to get sample:', ex.message);
      return null;
    }
  }

  async createSample(dto: CreateSampleDto) {
    // Remove associatedItemIds from dto before creating prisma record
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { associatedItemIds, ...sampleData } = dto;

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

  async updateSample(id: number, dto: UpdateSampleDto) {
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
    } catch (ex) {
      console.error(ex.message);
      return null;
    }
  }

  /** Soft delete sample by setting IsActive to false   */
  async deleteSample(id: number, deletedBy?: string) {
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
}
