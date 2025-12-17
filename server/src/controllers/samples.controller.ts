import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SamplesService } from 'src/services/samples.service';
import { CreateSampleDto, UpdateSampleDto } from 'src/utils/types';

@Controller('samples')
export class SamplesController {
  constructor(private readonly service: SamplesService) {}

  @Get('')
  async getAllSamples() {
    return await this.service.getAllSamples();
  }

  @Get(':id')
  async getSampleById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getSampleById(id);
  }

  @Post('')
  async createSample(@Body() dto: CreateSampleDto) {
    return await this.service.createSample(dto);
  }

  @Put(':id')
  async updateSample(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSampleDto,
  ) {
    return await this.service.updateSample(id, dto);
  }

  @Delete(':id')
  async deleteSample(@Param('id', ParseIntPipe) id: number) {
    return await this.service.deleteSample(id);
  }
}
