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
  private readonly labelConfig = {
    widthMm: 45,
    heightMm: 28,
    qrCode: { x: 20, y: 40 },
    text_X: 190,
    itemId_Y: 50,
    refCliente_Y: 120,
    encomenda_Y: 160,
  };

  async printLabel(
    dto: PrintLabelDto,
  ): Promise<{ success: boolean; message: string }> {
    const { itemId } = dto;

    try {
      // Generate TSPL commands
      const tsplCommands = this.generateTsplCommands(dto);

      // Write to temp file
      const tempFile = path.join(os.tmpdir(), `label_${Date.now()}.prn`);
      fs.writeFileSync(tempFile, tsplCommands, { encoding: 'ascii' });

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

  private generateTsplCommands(dto: PrintLabelDto): string {
    const { itemId, itemUrl, refCliente, encomenda } = dto;
    const {
      widthMm,
      heightMm,
      qrCode,
      text_X,
      itemId_Y,
      refCliente_Y,
      encomenda_Y,
    } = this.labelConfig;

    // Start building TSPL commands
    const lines = [
      `SIZE ${widthMm} mm, ${heightMm} mm`,
      'GAP 2 mm, 0',
      'CLS',
      'DIRECTION 1,0',
      `QRCODE ${qrCode.x},${qrCode.y},L,5,A,0,M2,S7,"${itemUrl}"`,
    ];

    if (!refCliente && !encomenda) {
      // Center itemId if no additional info
      lines.push(`TEXT ${text_X + 10},100,"3",0,1,2,"${itemId}"`);
    } else {
      lines.push(`TEXT ${text_X},${itemId_Y},"2",0,1,1,${itemId}`); // Standard itemId position

      // if refcliente length > 10, split into two lines
      if (refCliente.length > 10) {
        const firstLine = refCliente.slice(0, 10);
        const secondLine = refCliente.slice(10);
        lines.push(`TEXT ${text_X},${refCliente_Y - 5},"2",0,1,1,${firstLine}`);
        lines.push(
          `TEXT ${text_X},${refCliente_Y + 10},"2",0,1,1,${secondLine}`,
        );
      } else {
        // Single line refcliente
        lines.push(`TEXT ${text_X},${refCliente_Y},"2",0,1,1,${refCliente}`);
      }

      // Encomenda line
      lines.push(`TEXT ${text_X},${encomenda_Y},"2",0,1,1,${encomenda}`);
    }

    // Finalize
    lines.push('PRINT 1,1');
    return lines.join('\r\n') + '\r\n';
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
