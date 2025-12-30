import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ConnectorRepo } from 'src/repository/connectors.repo';

@Injectable()
export class ConnectorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: ConnectorRepo,
  ) {}

  async getConnectorTypes() {
    return this.repo.getConnectorTypes();
  }

  async getConnectors() {
    const connectors = await this.repo.getConnectors();

    // Fetch client references from legacy table
    let clientMappings: any[] = [];
    try {
      clientMappings = await (this.prisma as any).$queryRawUnsafe(`
        SELECT RefDIVMAC, RefMARCA 
        FROM ImageFeaturesDB.dbo.RefClientes_Marca 
        WHERE ESTADO = 1
      `);
    } catch (error) {
      console.error('Error fetching client mappings:', error.message);
    }

    // Group mappings by RefDIVMAC
    const mappingStore: Record<string, string[]> = {};
    clientMappings.forEach((m) => {
      if (!mappingStore[m.RefDIVMAC]) mappingStore[m.RefDIVMAC] = [];
      if (!mappingStore[m.RefDIVMAC].includes(m.RefMARCA)) {
        mappingStore[m.RefDIVMAC].push(m.RefMARCA);
      }
    });

    // Flatten the Connectors_Details into the main object and attach client references
    return connectors.map((conn) => ({
      ...conn,
      Fabricante: conn.Connectors_Details?.Fabricante,
      Refabricante: conn.Connectors_Details?.Refabricante,
      Family: conn.Connectors_Details?.Family,
      ClientReferences: mappingStore[conn.CODIVMAC] || [],
    }));
  }

  async updateConnector(codivmac: string, data: any) {
    return this.repo.updateConnectorProperties(codivmac, data);
  }
}
