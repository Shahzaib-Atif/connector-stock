import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DBService } from 'src/services/db.service';

@Controller()
export class MetadataController {
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

  @Get('positions')
  async getCord_CON() {
    return await this.dbService.getCord_CON();
  }
}
