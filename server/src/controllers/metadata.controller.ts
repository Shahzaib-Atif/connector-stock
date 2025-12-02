import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MetadataRepo } from 'src/repository/metadata.repo';

@Controller()
export class MetadataController {
  constructor(private readonly repo: MetadataRepo) {}

  @Get('cors')
  @ApiOperation({ summary: 'Get all colors' })
  async getCors() {
    return await this.repo.getCors();
  }

  @Get('vias')
  async getVias() {
    return await this.repo.getVias();
  }

  @Get('positions')
  async getCord_CON() {
    return await this.repo.getCord_CON();
  }
}
