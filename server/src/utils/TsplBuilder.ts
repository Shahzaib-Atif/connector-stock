import { PrintLabelDto } from 'src/dtos/print.dto';
import { addQrCode, addText, labelConfig } from './printUtils';

// Layout logic
export class TsplBuilder {
  build(dto: PrintLabelDto, useSmallLabels: boolean | undefined) {
    // Start building TSPL commands
    const lines = this.getInitialLines();

    // Add source-specific formatting (QR code, text positions, etc.)
    this.buildLayout(dto, lines, useSmallLabels);

    // determine print quantity (default to 1 if invalid)
    this.addPrintQty(dto.qty, lines);

    return lines.join('\r\n') + '\r\n';
  }

  private getInitialLines() {
    // Start building TSPL commands
    const { widthMm, heightMm } = labelConfig;
    return [
      `SIZE ${widthMm} mm, ${heightMm} mm`,
      'GAP 2 mm, 0',
      'CLS',
      'DIRECTION 1,0',
    ];
  }

  private buildLayout(
    dto: PrintLabelDto,
    lines: string[],
    useSmallLabels: boolean | undefined,
  ) {
    switch (dto.source) {
      case 'sample': {
        this.buildSampleLayout(lines, dto, useSmallLabels);
        break;
      }

      case 'box': {
        this.buildBoxLayout(dto, lines);
        break;
      }

      case 'connector': {
        this.buildConnectorLayout(dto, lines, useSmallLabels);
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

  private buildConnectorLayout(
    dto: PrintLabelDto,
    lines: string[],
    useSmallLabels: boolean | undefined,
  ) {
    if (useSmallLabels) {
      this.buildTsplForSmallLabels(lines, dto);
    } else {
      const { itemId, itemUrl } = dto;
      const { qrCodePos, center_X } = labelConfig;
      const { x: qr_x, y: qr_y } = qrCodePos;
      addQrCode(lines, qr_x, qr_y + 20, itemUrl);
      addText(lines, center_X + 10, 90, itemId, '"3"', 1, 2);
    }
  }

  private buildSampleLayout(
    lines: string[],
    dto: PrintLabelDto,
    useSmallLabels: boolean | undefined,
  ) {
    if (useSmallLabels) {
      this.buildTsplForSmallLabels(lines, dto);
    } else {
      this.buildTsplForNormalLabels(lines, dto);
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

  private buildTsplForSmallLabels(lines: string[], dto: PrintLabelDto) {
    const { itemId, itemUrl } = dto;
    const { center_X } = labelConfig;

    const MAX_LENGTH = 10;
    const LINE_SPACING = 25;

    const qrSize = 3;
    const qrLength = 85; // for size 3 => 85 dots (same width and height)
    const padding = 20;

    const qr_x = 20; // qrcode position
    const qr_y = 20;
    const text_x = qr_x - 10; // text position
    const text_y = qr_y + qrLength + padding;

    // first set of qrcode and text (left-half)
    addQrCode(lines, qr_x, qr_y, itemUrl, qrSize);
    for (let i = 0; i < itemId.length; i += MAX_LENGTH) {
      addText(
        lines,
        text_x,
        text_y + (i / MAX_LENGTH) * LINE_SPACING,
        itemId.slice(i, i + MAX_LENGTH),
      );
    }

    // second set of qrcode and text (right-half)
    addQrCode(lines, center_X + qr_x, qr_y, itemUrl, qrSize);
    for (let i = 0; i < itemId.length; i += MAX_LENGTH) {
      addText(
        lines,
        center_X + text_x,
        text_y + (i / MAX_LENGTH) * LINE_SPACING,
        itemId.slice(i, i + MAX_LENGTH),
      );
    }
  }

  private buildTsplForNormalLabels(lines: string[], dto: PrintLabelDto) {
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

  private addPrintQty(qty: number | undefined, lines: string[]) {
    const n = Number(qty);
    const printQty = Number.isInteger(n) && n > 0 ? n : 1; // positive integer only
    lines.push(`PRINT ${printQty},1`);
  }
}
