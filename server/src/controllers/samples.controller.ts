import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SamplesService } from 'src/services/samples.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateSampleDto, UpdateSampleDto } from 'src/dtos/samples.dto';

@Controller('api/samples')
export class SamplesController {
  constructor(private readonly service: SamplesService) {}

  @Get('')
  async getAllSamples() {
    return await this.service.getAllSamples();
  }

  @Get('analise-tab/:refCliente')
  async getAnaliseTabByRefCliente(@Param('refCliente') refCliente: string) {
    return await this.service.getAnaliseTabByRefCliente(refCliente);
  }
  @Get('reg-amostras-enc/:refCliente')
  async getRegAmostrasEnc(
    @Param('refCliente') refCliente: string,
    @Query('projeto') projeto: string,
    @Query('conectorDV') conectorDV: string,
  ) {
    return await this.service.getRegAmostrasEnc(
      refCliente,
      projeto,
      conectorDV,
    );
  }

  @Get('from-orc')
  async getSamplesFromORC(@Query('numorc') numorc: string) {
    return await this.service.getSamplesFromORC(numorc);
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
