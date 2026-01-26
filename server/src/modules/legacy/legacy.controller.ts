import { Controller, Get } from '@nestjs/common';
import { LegacyService } from './legacy.service';

@Controller('api/legacy')
export class LegacyController {
  constructor(private readonly service: LegacyService) {}

  @Get('backups')
  async getBackups() {
    return await this.service.getBackups();
  }
}
