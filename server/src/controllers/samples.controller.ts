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
import { SamplesRepo } from 'src/repository/samples.repo';
import { CreateSampleDto, UpdateSampleDto } from 'src/utils/types';

@Controller('samples')
export class SamplesController {
  constructor(private readonly repo: SamplesRepo) {}

  @Get('')
  async getAllSamples() {
    return await this.repo.getAllSamples();
  }

  @Get(':id')
  async getSampleById(@Param('id', ParseIntPipe) id: number) {
    return await this.repo.getSampleById(id);
  }

  @Post('')
  async createSample(@Body() dto: CreateSampleDto) {
    return await this.repo.createSample(dto);
  }

  @Put(':id')
  async updateSample(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSampleDto,
  ) {
    return await this.repo.updateSample(id, dto);
  }

  @Delete(':id')
  async deleteSample(@Param('id', ParseIntPipe) id: number) {
    return await this.repo.deleteSample(id);
  }
}
