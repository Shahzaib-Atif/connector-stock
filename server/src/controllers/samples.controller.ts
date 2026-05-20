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
import { CreateSamplesDto, SamplesDto } from '@shared/dto/SamplesDto';
import { AnaliseTabQueryDto } from '@shared/dto/AnaliseTabQueryDto';
import { SamplesQueryDto } from '@shared/dto/SamplesQueryDto';

@Controller('api/samples')
export class SamplesController {
  constructor(private readonly service: SamplesService) {}

  @Get('')
  async getSamples(@Query() query: SamplesQueryDto) {
    return await this.service.getSamplesPage(query);
  }

  @Get('options')
  async getSamplesOptions() {
    return await this.service.getSamplesOptions();
  }

  @Post('refresh')
  async refreshSamplesCache() {
    return await this.service.refreshSamplesCache('frontend-change');
  }

  @Get('analise-tab')
  async getAnaliseTab(@Query() query: AnaliseTabQueryDto) {
    return await this.service.getAnaliseTab(query);
  }

  @Post('analise-tab/refresh')
  async refreshAnaliseTabCache() {
    return await this.service.refreshAnaliseTabCache('frontend-change');
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

  @Get('all-from-orc')
  async getAllSamplesFromORC() {
    return await this.service.getAllSamplesFromORC();
  }

  @Get('orc-search')
  async searchOrcSamples(@Query('query') query: string) {
    return await this.service.searchOrcSamples(query ?? '');
  }

  @Get(':id')
  async getSampleById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getSampleById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createSample(@Body() dto: CreateSamplesDto) {
    return await this.service.createSample(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateSample(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SamplesDto,
  ) {
    return await this.service.updateSample(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteSample(@Param('id', ParseIntPipe) id: number) {
    return await this.service.deleteSample(id);
  }
}
