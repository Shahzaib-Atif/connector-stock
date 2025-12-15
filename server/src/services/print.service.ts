import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { PrintLabelDto } from 'src/dtos/PrintLabelDto';

const execAsync = promisify(exec);

@Injectable()
export class PrintService {
  private readonly logger = new Logger(PrintService.name);
  private readonly printerName = 'TSC TE200';
  private readonly rawPrinterExe = path.join(
    __dirname,
    '../../../scripts/RawPrinter.exe',
  );

  // Label dimensions: 45x28mm @ 203 DPI (8 dots/mm)
  private readonly labelWidthMm = 45;
  private readonly labelHeightMm = 28;
  private readonly qrCode_X = 20;
  private readonly qrCode_Y = 40;
  private readonly text_X = 200;
  private readonly itemId_Y = 50;
  private readonly refCliente_Y = 120;
  private readonly encomenda_Y = 160;

  async printLabel(
    dto: PrintLabelDto,
  ): Promise<{ success: boolean; message: string }> {
    const { itemId, itemUrl } = dto;

    try {
      // Generate TSPL commands
      const tsplCommands = this.generateTsplCommands(itemId, itemUrl);

      // Write to temp file
      const tempFile = path.join(os.tmpdir(), `label_${Date.now()}.prn`);
      fs.writeFileSync(tempFile, tsplCommands, { encoding: 'ascii' });
      this.logger.log(`TSPL file: ${tempFile}`);

      // Send to printer
      await this.sendToPrinter(tempFile);

      // Cleanup
      this.cleanupFile(tempFile);

      return { success: true, message: `Label printed for ${itemId}` };
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Print failed: ${message}`);
      return { success: false, message };
    }
  }

  private generateTsplCommands(itemId: string, itemUrl: string): string {
    return (
      [
        `SIZE ${this.labelWidthMm} mm, ${this.labelHeightMm} mm`,
        'GAP 2 mm, 0',
        'CLS',
        'DIRECTION 1,0',
        `QRCODE ${this.qrCode_X},${this.qrCode_Y},L,5,A,0,M2,S7,"${itemUrl}"`,
        `TEXT ${this.text_X},${this.itemId_Y},"3",0,1,2,"${itemId}"`,
        `TEXT ${this.text_X},${this.refCliente_Y},"2",0,1,1,"refCliente_Y"`,
        `TEXT ${this.text_X},${this.encomenda_Y},"2",0,1,1,"encomenda_Y"`,
        'PRINT 1,1',
      ].join('\r\n') + '\r\n'
    );
  }

  private async sendToPrinter(filePath: string): Promise<void> {
    // Check if RawPrinter.exe exists
    if (!fs.existsSync(this.rawPrinterExe)) {
      throw new Error(
        `RawPrinter.exe not found at ${this.rawPrinterExe}. Run build.bat in scripts folder.`,
      );
    }

    const command = `"${this.rawPrinterExe}" "${this.printerName}" "${filePath}"`;
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
