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
    try {
      return await this.prisma.rEG_Amostras.create({
        data: {
          ...dto,
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
      return await this.prisma.rEG_Amostras.update({
        where: { ID: id },
        data: {
          ...dto,
          DateOfLastUpdate: new Date().toISOString(),
        },
      });
    } catch (ex: any) {
      console.error('Failed to update sample:', ex.message);
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
