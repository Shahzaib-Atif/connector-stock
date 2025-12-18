import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SamplesService } from 'src/services/samples.service';
import { CreateSampleDto, UpdateSampleDto } from 'src/utils/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createSample(@Body() dto: CreateSampleDto) {
    return await this.service.createSample(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateSample(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSampleDto,
  ) {
    return await this.service.updateSample(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteSample(@Param('id', ParseIntPipe) id: number) {
    return await this.service.deleteSample(id);
  }
}
