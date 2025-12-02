import { Controller, Get } from '@nestjs/common';
import { ConnectorRepo } from 'src/repository/connectors.repo';

@Controller('connectors')
export class ConnectorController {
  constructor(private readonly repo: ConnectorRepo) {}

  @Get('/types')
  async getConnectorTypes() {
    return await this.repo.getConnectorTypes();
  }

  @Get('')
  async getReferencias() {
    return await this.repo.getConnectors();
  }
}
