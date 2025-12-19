import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';
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
    tx: TransactionClient,
    codivmac?: string | null,
    delta?: number,
  ) {
    if (!codivmac || !delta) return;

    await tx.connectors_Main.update({
      where: { CODIVMAC: codivmac },
      data: { Qty: { increment: delta } },
    });
  }

  private async upsertReferenceMapping(
    tx: TransactionClient,
    amostra?: string | null,
    refDescricao?: string | null,
    user?: string | null,
    dataRecepcao?: string | null,
    entregueA?: string | null,
    nEnvio?: string | null,
  ) {
    if (
      !amostra ||
      amostra.toUpperCase().includes('NEW') ||
      !refDescricao ||
      !dataRecepcao ||
      !entregueA ||
      !nEnvio
    ) {
      return;
    }

    const currentUser = user || 'system';

    try {
      // mapping: RefDIVMAC = Amostra, RefMARCA = Ref_Descricao
      // Using multi-part name as ImageFeaturesDB.dbo.RefClientes_Marca
      await tx.$executeRaw`
        INSERT INTO ImageFeaturesDB.dbo.RefClientes_Marca (RefDIVMAC, RefMARCA, LastChangeBy, LastUpdateDate, createdByApp)
        SELECT ${amostra}, ${refDescricao}, ${currentUser}, GETDATE(), 1
        WHERE NOT EXISTS (
          SELECT 1 FROM ImageFeaturesDB.dbo.RefClientes_Marca 
          WHERE RefDIVMAC = ${amostra} AND RefMARCA = ${refDescricao} AND ESTADO = 1
        )
      `;
    } catch (error) {
      console.error('Error upserting reference mapping:', error.message);
      // We log but don't necessarily want to fail the main sample update if mapping fails
    }
  }

  /** Get all samples with unique projects and clients */
  async getAllSamples() {
    const samples = await this.samplesRepo.getAllSamples();
    // create a unique array of projects from samples
    const projects = new Set(samples.map((s) => s.Projeto).filter(Boolean));
    const clients = new Set(samples.map((s) => s.Cliente).filter(Boolean));

    return {
      samples,
      projects: Array.from(projects),
      clients: Array.from(clients),
    };
  }

  async getSampleById(id: number) {
    return this.samplesRepo.getSampleById(id);
  }

  // Create sample and adjust connector quantities accordingly
  async createSample(dto: CreateSampleDto) {
    return await this.prisma.$transaction(async (tx) => {
      // Create sample record
      const created = await tx.rEG_Amostras.create({
        data: {
          ...dto,
          IsActive: true,
          DateOfCreation: new Date(),
        },
      });

      // Adjust connector quantity
      const delta = this.parseQuantity(dto.Quantidade);
      await this.adjustConnectorQty(tx, dto.Amostra, delta);

      // Upsert reference mapping if relevant fields are provided
      await this.upsertReferenceMapping(
        tx,
        dto.Amostra,
        dto.Ref_Descricao,
        dto.CreatedBy,
        dto.Data_recepcao,
        dto.Entregue_a,
        dto.N_Envio,
      );

      return created;
    });
  }

  // Update sample and adjust connector quantities accordingly
  async updateSample(id: number, dto: UpdateSampleDto) {
    return await this.prisma.$transaction(async (tx) => {
      // Fetch existing sample
      const existing = await tx.rEG_Amostras.findUnique({
        where: { ID: id },
      });

      if (!existing) {
        throw new Error(`Sample with ID ${id} not found`);
      }

      // Update sample record
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

      // Upsert reference mapping if relevant fields are provided
      await this.upsertReferenceMapping(
        tx,
        targetAmostra,
        dto.Ref_Descricao ?? existing?.Ref_Descricao,
        dto.LasUpdateBy,
        dto.Data_recepcao ?? existing?.Data_recepcao,
        dto.Entregue_a ?? existing?.Entregue_a,
        dto.N_Envio ?? existing?.N_Envio,
      );

      return updated;
    });
  }

  // Soft delete sample and revert connector quantity
  async deleteSample(id: number, deletedBy?: string) {
    return this.samplesRepo.deleteSample(id, deletedBy);
  }
}
