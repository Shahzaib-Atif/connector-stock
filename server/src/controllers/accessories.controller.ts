import { Controller, Get } from '@nestjs/common';
import { AccessoryRepo } from 'src/repository/accessories.repo';

@Controller('api/accessories')
export class AccessoryController {
  constructor(private readonly repo: AccessoryRepo) {}

  @Get('/types')
  async getAccessoryTypes() {
    return await this.repo.getAccessoryTypes();
  }

  @Get('')
  async getAccessories() {
    return await this.repo.getAccessories();
  }
}
