import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SamplesRepo } from 'src/repository/samples.repo';
import { CreateSampleDto, UpdateSampleDto } from 'src/utils/types';

@Injectable()
export class SamplesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly samplesRepo: SamplesRepo,
  ) {}

  private parseQuantity(qty?: string | null): number {
    const parsed = Number(qty);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private async adjustConnectorQty(
    tx: any,
    codivmac?: string | null,
    delta?: number,
  ) {
    if (!codivmac || !delta) return;

    await tx.referencias_test.update({
      where: { CODIVMAC: codivmac },
      data: { Qty: { increment: delta } },
    });
  }

  async getAllSamples() {
    const samples = await this.samplesRepo.getAllSamples();
    // create a unique array of projects from samples
    const projects = new Set(samples.map((s) => s.Projeto).filter(Boolean));

    return { samples, projects: Array.from(projects) };
  }

  async getSampleById(id: number) {
    return this.samplesRepo.getSampleById(id);
  }

  async createSample(dto: CreateSampleDto) {
    return await this.prisma.$transaction(async (tx) => {
      const created = await tx.rEG_Amostras.create({
        data: {
          ...dto,
          IsActive: true,
          DateOfCreation: new Date(),
        },
      });

      const delta = this.parseQuantity(dto.Quantidade);
      await this.adjustConnectorQty(tx, dto.Amostra, delta);

      return created;
    });
  }

  async updateSample(id: number, dto: UpdateSampleDto) {
    return await this.prisma.$transaction(async (tx) => {
      const existing = await tx.rEG_Amostras.findUnique({
        where: { ID: id },
      });

      const updated = await tx.rEG_Amostras.update({
        where: { ID: id },
        data: {
          ...dto,
          DateOfLastUpdate: new Date().toISOString(),
          LasUpdateBy: dto.LasUpdateBy,
        },
      });

      // Revert previous reservation then apply new one
      const previousQty = this.parseQuantity(existing?.Quantidade);
      await this.adjustConnectorQty(tx, existing?.Amostra, previousQty * -1);

      const newQty = this.parseQuantity(dto.Quantidade ?? existing?.Quantidade);
      const targetAmostra = dto.Amostra ?? existing?.Amostra;
      await this.adjustConnectorQty(tx, targetAmostra, newQty);

      return updated;
    });
  }

  async deleteSample(id: number, deletedBy?: string) {
    return this.samplesRepo.deleteSample(id, deletedBy);
  }
}
