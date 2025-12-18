import { Controller, Get } from '@nestjs/common';
import { ConnectorsService } from 'src/services/connectors.service';

@Controller('connectors')
export class ConnectorController {
  constructor(private readonly service: ConnectorsService) {}

  @Get('/types')
  async getConnectorTypes() {
    return await this.service.getConnectorTypes();
  }

  @Get('')
  async getReferencias() {
    return await this.service.getConnectors();
  }
}
