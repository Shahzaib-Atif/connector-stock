import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DBService } from 'src/services/db.service';

@Controller()
export class DBController {
  constructor(private readonly dbService: DBService) {}

  @Get('cors')
  @ApiOperation({ summary: 'Get all colors' })
  async getCors() {
    return await this.dbService.getCors();
  }

  @Get('vias')
  async getVias() {
    return await this.dbService.getVias();
  }

  @Get('accessory-types')
  async getAccessoryTypes() {
    return await this.dbService.getAccessoryTypes();
  }

  @Get('connector-types')
  async getConnectorTypes() {
    return await this.dbService.getConnectorTypes();
  }

  @Get('Cord_CON')
  async getCord_CON() {
    return await this.dbService.getCord_CON();
  }

  @Get('Referencias')
  async getReferencias() {
    return await this.dbService.getReferencias();
  }

  @Get('Accessories')
  async getAccessories() {
    return await this.dbService.getAccessories();
  }
}
