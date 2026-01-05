import { Controller, Post, Body, Logger } from '@nestjs/common';
import { PrintService } from '../services/print.service';
import { PrintLabelDto } from 'src/dtos/print.dto';

@Controller('api/print')
export class PrintController {
  private readonly logger = new Logger(PrintController.name);

  constructor(private readonly printService: PrintService) {}

  @Post('label')
  async printLabel(@Body() dto: PrintLabelDto) {
    this.logger.log(`Print label request for: ${dto.itemId}`);
    return this.printService.printLabel(dto);
  }
}
