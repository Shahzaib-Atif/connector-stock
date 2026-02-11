import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { PrintLabelDto } from 'src/dtos/print.dto';
import getErrorMsg from 'src/utils/getErrorMsg';
import { addQrCode, addText, labelConfig } from 'src/utils/printUtils';

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
      const tsplCommands = this.generateTsplCommands(dto);

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

  private generateTsplCommands(dto: PrintLabelDto): string {
    const { qty } = dto;
    const { widthMm, heightMm } = labelConfig;

    // Start building TSPL commands
    const lines = [
      `SIZE ${widthMm} mm, ${heightMm} mm`,
      'GAP 2 mm, 0',
      'CLS',
      'DIRECTION 1,0',
    ];

    // Add source-specific formatting (QR code, text positions, etc.)
    this.buildLayout(dto, lines);

    // determine print quantity (default to 1 if invalid)
    const n = Number(qty);
    const printQty = Number.isInteger(n) && n > 0 ? n : 1; // positive integer only

    lines.push(`PRINT ${printQty},1`);
    return lines.join('\r\n') + '\r\n';
  }

  private buildLayout(dto: PrintLabelDto, lines: string[]) {
    switch (dto.source) {
      case 'sample': {
        this.buildSampleLayout(lines, dto);
        break;
      }

      case 'box': {
        this.buildBoxLayout(dto, lines);
        break;
      }

      case 'connector': {
        this.buildConnectorLayout(dto, lines);
        break;
      }

      default: {
        break;
      }
    }
  }

  private buildBoxLayout(dto: PrintLabelDto, lines: string[]) {
    const { itemId, itemUrl } = dto;
    const { qrCodePos } = labelConfig;
    const { x: qr_x, y: qr_y } = qrCodePos;

    const x = qr_x + 5;
    addQrCode(lines, x, qr_y + 15, itemUrl, 7, 2, 12);
    addText(lines, x, qr_y - 15, itemId);
  }

  private buildConnectorLayout(dto: PrintLabelDto, lines: string[]) {
    const { itemId, itemUrl } = dto;
    const { qrCodePos, center_X } = labelConfig;
    const { x: qr_x, y: qr_y } = qrCodePos;

    addQrCode(lines, qr_x, qr_y + 20, itemUrl);
    addText(lines, center_X + 10, 90, itemId, '"3"', 1, 2);
  }

  private buildSampleLayout(lines: string[], dto: PrintLabelDto) {
    const { itemId, itemUrl, refCliente, encomenda } = dto;
    const { qrCodePos, center_X } = labelConfig;
    const { x: qr_x, y: qr_y } = qrCodePos;

    // Add QR Code
    addQrCode(lines, qr_x - 10, qr_y + 20, itemUrl, 5);

    // Add Text
    const textX = center_X + 15;
    const textY = itemId?.length > 12 ? 210 : 200; // Near bottom edge (224)
    addText(lines, textX, textY, itemId, '"2"', 2, 1, 270);

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
      addText(lines, currentX + 15, textY, encomenda, '"2"', 1, 1, 270);
    }
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
      const x = startX + index * LINE_SPACING;
      addText(lines, x, startY, text, '"2"', 1, 1, 270);
    });

    return startX + chunks.length * LINE_SPACING; // Return next X position
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
