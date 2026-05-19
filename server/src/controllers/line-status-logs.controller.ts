import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { CreateLineStatusLogDto } from '@shared/dto/CreateLineStatusLogDto';
import { CreateUpdateConnNameLogDto } from '@shared/dto/CreateUpdateConnNameLogDto';
import { LineStatusLogsService } from 'src/services/line-status-logs.service';

@Controller('api/line-status-logs')
export class LineStatusLogsController {
  constructor(private readonly service: LineStatusLogsService) {}

  @Post('')
  async create(
    @Body() dto: CreateLineStatusLogDto,
    @Ip() ip: string,
    @Headers('referer') referer?: string,
  ) {
    return await this.service.create(dto, {
      ip,
      referer,
    });
  }

  @Post('update-conn-name')
  async createUpdateConnName(
    @Body() dto: CreateUpdateConnNameLogDto,
    @Ip() ip: string,
    @Headers('referer') referer?: string,
  ) {
    return await this.service.createUpdateConnName(dto, {
      ip,
      referer,
    });
  }
}
