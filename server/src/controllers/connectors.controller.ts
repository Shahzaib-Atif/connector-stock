import { Controller, Get } from '@nestjs/common';
import { DBService } from 'src/services/db.service';

@Controller('connectors')
export class ConnectorController {
  constructor(private readonly dbService: DBService) {}

  @Get('/types')
  async getConnectorTypes() {
    return await this.dbService.getConnectorTypes();
  }

  @Get('')
  async getReferencias() {
    return await this.dbService.getReferencias();
  }
}
