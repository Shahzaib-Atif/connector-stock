import { Controller, Get } from '@nestjs/common';
import { DBService } from 'src/services/db.service';

@Controller('accessories')
export class AccessoryController {
  constructor(private readonly dbService: DBService) {}

  @Get('/types')
  async getAccessoryTypes() {
    return await this.dbService.getAccessoryTypes();
  }

  @Get('')
  async getAccessories() {
    return await this.dbService.getAccessories();
  }
}
