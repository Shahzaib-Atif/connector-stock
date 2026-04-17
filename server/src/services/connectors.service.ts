import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { ConnectorDto } from '@shared/dto/ConnectorDto';
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

  async updateConnector(codivmac: string, data: ConnectorDto) {
    // Ensure Qty is consistent with Qty_com_fio and Qty_sem_fio
    if (data.Qty !== data.Qty_com_fio + data.Qty_sem_fio) {
      data.Qty = data.Qty_com_fio + data.Qty_sem_fio;
    }

    return this.repo.updateConnectorProperties(codivmac, data);
  }
}
