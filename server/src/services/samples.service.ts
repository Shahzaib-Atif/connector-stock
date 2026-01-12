import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';
import { SamplesRepo } from 'src/repository/samples.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { CreateSampleDto, UpdateSampleDto } from 'src/dtos/samples.dto';

@Injectable()
export class SamplesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly samplesRepo: SamplesRepo,
    private readonly connectorRepo: ConnectorRepo,
  ) {}

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

      // Apply new reservation
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

  //#region -- Private Helpers
  private parseQuantity(qty?: string | null): number {
    const parsed = Number(qty);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private async adjustConnectorQty(
    tx: TransactionClient,
    amostra?: string | null,
    delta?: number,
  ) {
    if (!amostra || !delta) return;

    const codivmac = this.getConnectorId(amostra);
    await this.connectorRepo.adjustQuantity(tx, codivmac, delta);
  }

  private getConnectorId(amostra: string): string {
    if (!amostra) return '';

    const cleanAmostra = amostra.trim();

    if (cleanAmostra.includes('+')) {
      const partBeforePlus = cleanAmostra.split('+')[0].trim();
      // Return first 6 characters as requested
      return partBeforePlus.substring(0, 6);
    }

    return cleanAmostra;
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
      // Perform upsert operation for reference mapping
      await this.connectorRepo.upsertReferenceMapping(
        tx,
        amostra,
        refDescricao,
        currentUser,
      );
    } catch (error) {
      console.error('Error upserting reference mapping:', error.message);
      // We log but don't necessarily want to fail the main sample update if mapping fails
    }
  }
  //#endregion
}
