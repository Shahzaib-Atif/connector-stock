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
    qrCodePos: { x: 20, y: 40 },
    center_X: 180, // (45*8)/2 = 180 dots
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
    const { itemId, itemUrl, refCliente, encomenda, source } = dto;
    const { widthMm, heightMm, qrCodePos, center_X } = this.labelConfig;
    const { x: qr_x, y: qr_y } = qrCodePos;

    // Start building TSPL commands
    const lines = [
      `SIZE ${widthMm} mm, ${heightMm} mm`,
      'GAP 2 mm, 0',
      'CLS',
      'DIRECTION 1,0',
    ];

    switch (source) {
      case 'sample': {
        // QR Code
        lines.push(`QRCODE ${qr_x},${qr_y},L,5,A,0,M2,S7,"${itemUrl}"`);

        const textX = center_X + 15;
        const textY = 200; // Near bottom edge

        // ItemId
        lines.push(`TEXT ${textX},${textY},"2",270,2,1,"${itemId}"`);

        // RefCliente
        let currentX = textX + 45; // Spacing for next line
        if (refCliente) {
          currentX = this.addRefClientTextVertical(
            lines,
            refCliente,
            currentX,
            textY,
          );
        }

        // Encomenda
        if (encomenda) {
          lines.push(
            `TEXT ${currentX + 15},${textY},"2",270,1,1,"${encomenda}"`,
          );
        }

        break;
      }

      case 'box': {
        // add QR code and itemId
        lines.push(`QRCODE ${qr_x},${qr_y + 20},L,5,A,0,M2,S7,"${itemUrl}"`);
        lines.push(`TEXT ${qr_x},${qr_y - 10},"2",0,1,1,"${itemId}"`);
        lines.push(`TEXT ${center_X + 20},90,"3",0,1,2,"${itemId}"`);
        break;
      }

      case 'connector': {
        // add QR code and itemId
        lines.push(`QRCODE ${qr_x},${qr_y + 20},L,4,A,0,M2,S7,"${itemUrl}"`);
        lines.push(`TEXT ${center_X + 10},90,"3",0,1,2,"${itemId}"`);
        break;
      }

      default: {
        break;
      }
    }

    // Finalize
    lines.push('PRINT 1,1');
    return lines.join('\r\n') + '\r\n';
  }

  private addRefClientTextVertical(
    lines: string[],
    refCliente: string,
    startX: number,
    startY: number,
  ): number {
    const MAX_LENGTH = 12; // Shorter length due to restricted height (28mm)
    const MAX_LINES = 3;
    const LINE_SPACING = 25;

    // Split into chunks
    const chunks: string[] = [];
    const cleanRef = refCliente.replace(/\s+/g, ' ').trim(); // keep single spaces maybe? or remove all spaces?
    const refClienteModified = cleanRef.replace(/\s+/g, '');

    for (
      let i = 0;
      i < refClienteModified.length && chunks.length < MAX_LINES;
      i += MAX_LENGTH
    ) {
      chunks.push(refClienteModified.slice(i, i + MAX_LENGTH));
    }

    chunks.forEach((text, index) => {
      lines.push(
        `TEXT ${startX + index * LINE_SPACING},${startY},"2",270,1,1,"${text}"`,
      );
    });

    return startX + chunks.length * LINE_SPACING; // Return next X position
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
