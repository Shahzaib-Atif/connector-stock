import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { PrintLabelDto } from 'src/dtos/print.dto';
import { getErrorMsg } from '@shared/utils/getErrorMsg';
import { TsplBuilder } from 'src/utils/TsplBuilder';
import { PrinterClient } from 'src/utils/PrinterClient';
import { MemoryTelemetryService } from './memory-telemetry.service';

@Injectable()
export class PrintService {
  private readonly logger = new Logger(PrintService.name);
  private readonly rawPrinterExe = path.join(
    __dirname,
    '../../../scripts/RawPrinter.exe',
  );

  constructor(private readonly memoryTelemetry: MemoryTelemetryService) {}

  public async printLabel(
    dto: PrintLabelDto,
  ): Promise<{ success: boolean; message: string }> {
    const { itemId, useSmallLabels } = dto;
    this.logger.log(
      `Processing print request for ${itemId}. Small labels: ${useSmallLabels}`,
    );

    try {
      await this.memoryTelemetry.capture('print', 'before-print', {
        itemId,
        useSmallLabels,
        printer: dto.printer || 'PRINTER_1',
      });

      // Generate TSPL commands
      const tsplBuilder = new TsplBuilder();
      const tsplCommands = tsplBuilder.build(dto, useSmallLabels);

      // get printer
      const printer = this.getSelectedPrinter(dto.printer || 'PRINTER_1');

      // print using TSPL commands
      const printerClient = new PrinterClient();
      await printerClient.printRaw(tsplCommands, printer);
      await this.memoryTelemetry.capture('print', 'after-print', {
        itemId,
        useSmallLabels,
        printer: dto.printer || 'PRINTER_1',
      });

      return { success: true, message: `Label printed for ${itemId}` };
    } catch (error) {
      const message = getErrorMsg(error);
      await this.memoryTelemetry.capture('print', 'print-error', {
        itemId,
        useSmallLabels,
        printer: dto.printer || 'PRINTER_1',
        error: message,
      });
      this.logger.error(`Print failed: `, message);
      return { success: false, message };
    }
  }

  private getSelectedPrinter(printerKey: string): string {
    if (printerKey === 'PRINTER_1') return process.env.PRINTER_1 || '';
    else if (printerKey === 'PRINTER_2') return process.env.PRINTER_2 || '';
    else return '';
  }
}
