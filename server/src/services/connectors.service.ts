import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { ConnectorDto, CreateConnectorDto } from '@shared/dto/ConnectorDto';
import { ConnectorMapper } from '@infra/ConnectorMapper';

@Injectable()
export class ConnectorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: ConnectorRepo,
  ) {}

  async getConnectorTypes() {
    return this.repo.getConnectorTypes();
  }

  async getConnectors(): Promise<ConnectorDto[]> {
    const connectors = await this.repo.getConnectors();
    const clientMappings = await this.repo.getRefClientes_Marca();

    // Group mappings by RefDIVMAC
    const mappingStore: Record<string, string[]> = {};
    clientMappings.forEach((m) => {
      if (!mappingStore[m.RefDIVMAC]) mappingStore[m.RefDIVMAC] = [];
      if (!mappingStore[m.RefDIVMAC].includes(m.RefMARCA)) {
        mappingStore[m.RefDIVMAC].push(m.RefMARCA);
      }
    });

    // change the connector entity to its corresponding dto
    return connectors.map((conn) => ({
      ...ConnectorMapper.toDto(conn),
      clientReferences: mappingStore[conn.id] || [],
    }));
  }

  async createConnector(dto: CreateConnectorDto): Promise<ConnectorDto> {
    const normalizedDto = this.normalizeCreateDto(dto);
    this.validateCreateDto(normalizedDto);

    const existing = await this.repo.getConnectorByCodivmac(
      normalizedDto.CODIVMAC,
    );
    if (existing) {
      throw new ConflictException(
        `Connector already exists: ${normalizedDto.CODIVMAC}`,
      );
    }

    const created = await this.repo.createConnector(
      normalizedDto.CODIVMAC,
      normalizedDto,
    );
    if (!created) {
      throw new BadRequestException('Failed to create connector');
    }

    return created;
  }

  async updateConnector(codivmac: string, data: ConnectorDto) {
    // Ensure Qty is consistent with Qty_com_fio and Qty_sem_fio
    if (data.Qty !== data.Qty_com_fio + data.Qty_sem_fio) {
      data.Qty = data.Qty_com_fio + data.Qty_sem_fio;
    }

    return this.repo.updateConnectorProperties(codivmac, data);
  }

  private normalizeCreateDto(dto: CreateConnectorDto) {
    const PosId = dto.PosId.trim().toUpperCase();
    const Cor = dto.Cor.trim().toUpperCase();
    const Vias = dto.Vias.trim().toUpperCase();
    const Qty_com_fio = Math.max(0, dto.Qty_com_fio);
    const Qty_sem_fio = Math.max(0, dto.Qty_sem_fio);

    return {
      ...dto,
      PosId,
      Cor,
      Vias,
      ConnType: dto.ConnType?.trim() ? dto.ConnType.trim() : null,
      Fabricante: dto.details?.Fabricante?.trim()
        ? dto.details?.Fabricante.trim()
        : null,
      Refabricante: dto.details?.Refabricante?.trim()
        ? dto.details?.Refabricante.trim()
        : null,
      Qty_com_fio,
      Qty_sem_fio,
      Qty: Qty_com_fio + Qty_sem_fio,
      Family: dto.details?.Family || 1,
      ActualViaCount: Vias === 'X' ? dto.details?.ActualViaCount : null,
      CODIVMAC: `${PosId}${Cor}${Vias}`,
    };
  }

  private validateCreateDto(dto: CreateConnectorDto & { CODIVMAC: string }) {
    if (dto.PosId.length !== 4) {
      throw new BadRequestException('PosId must be 4 characters long.');
    }

    if (dto.CODIVMAC.length !== 6 && dto.CODIVMAC.length !== 8) {
      throw new BadRequestException(
        'CODIVMAC must be either 6 or 8 characters long.',
      );
    }

    if (dto.Vias === 'X' && (dto.details?.ActualViaCount ?? 0) < 31) {
      throw new BadRequestException(
        "As Vias is set to 'X', then ActualViaCount has to be greater than 30",
      );
    }
  }
}
