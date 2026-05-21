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
import { AnaliseSimilarQueryDto } from '@shared/dto/AnaliseSimilarQueryDto';
import { SamplesQueryDto } from '@shared/dto/SamplesQueryDto';

@Controller('api/samples')
export class SamplesController {
  constructor(private readonly service: SamplesService) {}

  // Returns paginated samples from server cache.
  @Get('')
  async getSamples(@Query() query: SamplesQueryDto) {
    return await this.service.getSamplesPage(query);
  }

  // Returns sample form autocomplete option lists.
  @Get('options')
  async getSamplesOptions() {
    return await this.service.getSamplesOptions();
  }

  // Invalidates and refreshes the samples cache.
  @Post('refresh')
  async refreshSamplesCache() {
    return await this.service.refreshSamplesCache('frontend-change');
  }

  // Returns paginated analise rows from cache.
  @Get('analise-tab')
  async getAnaliseTab(@Query() query: AnaliseTabQueryDto) {
    return await this.service.getAnaliseTab(query);
  }

  // Invalidates and refreshes the analise cache.
  @Post('analise-tab/refresh')
  async refreshAnaliseTabCache() {
    return await this.service.refreshAnaliseTabCache('frontend-change');
  }

  // Returns analise rows similar to the edited row.
  @Get('analise-tab/similar')
  async getSimilarAnaliseRows(@Query() query: AnaliseSimilarQueryDto) {
    return await this.service.getSimilarAnaliseRows(query);
  }

  // Returns analise rows for one RefCliente value.
  @Get('analise-tab/:refCliente')
  async getAnaliseTabByRefCliente(@Param('refCliente') refCliente: string) {
    return await this.service.getAnaliseTabByRefCliente(refCliente);
  }

  // Returns RegAmostrasEnc rows for sample wizard.
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

  // Returns sample rows linked to one ORC document.
  @Get('from-orc')
  async getSamplesFromORC(@Query('numorc') numorc: string) {
    return await this.service.getSamplesFromORC(numorc);
  }

  // Returns all ORC-linked rows from cache.
  @Get('all-from-orc')
  async getAllSamplesFromORC() {
    return await this.service.getAllSamplesFromORC();
  }

  // Searches cached ORC rows by document or reference.
  @Get('orc-search')
  async searchOrcSamples(@Query('query') query: string) {
    return await this.service.searchOrcSamples(query ?? '');
  }

  // Returns one sample row by numeric id.
  @Get(':id')
  async getSampleById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getSampleById(id);
  }

  // Creates a sample and related stock transactions.
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createSample(@Body() dto: CreateSamplesDto) {
    return await this.service.createSample(dto);
  }

  // Updates a sample and adjusts stock transactions.
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateSample(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SamplesDto,
  ) {
    return await this.service.updateSample(id, dto);
  }

  // Soft-deletes a sample and reverts stock.
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteSample(@Param('id', ParseIntPipe) id: number) {
    return await this.service.deleteSample(id);
  }
}
