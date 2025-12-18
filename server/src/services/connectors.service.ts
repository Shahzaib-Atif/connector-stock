import { Injectable } from '@nestjs/common';
import { ConnectorRepo } from 'src/repository/connectors.repo';

@Injectable()
export class ConnectorsService {
  constructor(private readonly repo: ConnectorRepo) {}

  async getConnectorTypes() {
    return this.repo.getConnectorTypes();
  }

  async getConnectors() {
    const connectors = await this.repo.getConnectors();

    // Flatten the Connectors_Details into the main object
    return connectors.map((conn) => ({
      ...conn,
      Fabricante: conn.Connectors_Details.Fabricante,
      Refabricante: conn.Connectors_Details.Refabricante,
    }));
  }
}
