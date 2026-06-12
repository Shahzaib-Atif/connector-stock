import { Body, Controller, Post } from '@nestjs/common';
import { CreateLineStatusLogDto } from '@shared/dto/DivDeskDtos';
import { CreateUpdateConnNameLogDto } from '@shared/dto/DivDeskDtos';
import { DivDeskLoggingService } from 'src/services/divdesk-log.service';

@Controller('api/line-status-logs')
export class LineStatusLogsController {
  constructor(private readonly service: DivDeskLoggingService) {}

  @Post('')
  async create(@Body() dto: CreateLineStatusLogDto) {
    return await this.service.create(dto);
  }

  @Post('update-conn-name')
  async createUpdateConnName(@Body() dto: CreateUpdateConnNameLogDto) {
    return await this.service.createUpdateConnName(dto);
  }
}
