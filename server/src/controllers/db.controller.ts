import { Controller, Get } from '@nestjs/common';
import { DBService } from 'src/services/db.service';

@Controller()
export class DBController {
  constructor(private readonly dbService: DBService) {}

  @Get('cors')
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
}
