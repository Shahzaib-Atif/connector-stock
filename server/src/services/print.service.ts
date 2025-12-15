import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

export interface PrintLabelDto {
  itemId: string;
  itemUrl: string;
}

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
        `QRCODE 20,30,L,4,A,0,M2,S7,"${itemUrl}"`,
        `TEXT 180,50,"3",0,1,2,"${itemId}"`,
        `TEXT 180,120,"2",0,1,1,"divmac stock"`,
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
