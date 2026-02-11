import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { PrintLabelDto } from 'src/dtos/print.dto';
import getErrorMsg from 'src/utils/getErrorMsg';
import { TsplBuilder } from 'src/utils/TsplBuilder';

const execAsync = promisify(exec);

@Injectable()
export class PrintService {
  private readonly logger = new Logger(PrintService.name);
  private readonly rawPrinterExe = path.join(
    __dirname,
    '../../../scripts/RawPrinter.exe',
  );

  public async printLabel(
    dto: PrintLabelDto,
  ): Promise<{ success: boolean; message: string }> {
    const { itemId } = dto;

    try {
      // Generate TSPL commands
      const tsplBuilder = new TsplBuilder();
      const tsplCommands = tsplBuilder.build(dto);

      // Write to temp file
      const tempFile = path.join(os.tmpdir(), `label_${Date.now()}.prn`);
      fs.writeFileSync(tempFile, tsplCommands, { encoding: 'ascii' });

      // Send to printer
      const printer = this.getSelectedPrinter(dto.printer || 'PRINTER_1');
      if (!printer)
        return { success: false, message: 'Printer not configured' };
      await this.sendToPrinter(tempFile, printer);

      // Cleanup
      this.cleanupFile(tempFile);

      return { success: true, message: `Label printed for ${itemId}` };
    } catch (error) {
      const message = getErrorMsg(error);
      this.logger.error(`Print failed: `, message);
      return { success: false, message };
    }
  }

  private getSelectedPrinter(printerKey: string): string {
    if (printerKey === 'PRINTER_1') return process.env.PRINTER_1 || '';
    else if (printerKey === 'PRINTER_2') return process.env.PRINTER_2 || '';
    else return '';
  }

  private async sendToPrinter(
    filePath: string,
    printerName: string,
  ): Promise<void> {
    // Check if RawPrinter.exe exists
    if (!fs.existsSync(this.rawPrinterExe)) {
      throw new Error(
        `RawPrinter.exe not found at ${this.rawPrinterExe}. Run build.bat in scripts folder.`,
      );
    }

    const command = `"${this.rawPrinterExe}" "${printerName}" "${filePath}"`;
    this.logger.log(`Executing: ${command}`);

    const { stdout, stderr } = await execAsync(command, { timeout: 30000 });

    if (stdout) this.logger.log(stdout.trim());
    if (stderr) this.logger.warn(stderr.trim());

    if (!stdout.includes('SUCCESS')) {
      throw new Error(stdout || stderr || 'Print failed');
    }
  }

  private cleanupFile(filePath: string): void {
    setTimeout(() => {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore cleanup errors
      }
    }, 5000);
  }
}
