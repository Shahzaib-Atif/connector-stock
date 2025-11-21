import { Controller, Get } from '@nestjs/common';
import { DBService } from '../services/db.service';

@Controller()
export class DBController {
  constructor(private readonly dbService: DBService) {}

  @Get('cors')
  async getCors() {
    return await this.dbService.getCors();
  }
}
