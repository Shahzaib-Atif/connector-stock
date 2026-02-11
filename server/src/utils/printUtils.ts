// Label dimensions: 45x28mm @ 203 DPI (8 dots/mm)
export const labelConfig = {
  widthMm: 45,
  heightMm: 28,
  qrCodePos: { x: 20, y: 40 },
  center_X: 180, // (45*8)/2 = 180 dots
  itemId_Y: 50,
  refCliente_Y: 120,
  encomenda_Y: 160,
};

export function addText(
  lines: string[],
  x: number,
  y: number,
  text: string,
  font = '"2"',
  xMul = 1,
  yMul = 1,
  rotation = 0,
) {
  lines.push(`TEXT ${x},${y},${font},${rotation},${xMul},${yMul},"${text}"`);
}

export function addQrCode(
  lines: string[],
  x: number,
  y: number,
  data: string,
  size = 4, // module size
  m = 2,
  s = 7,
  model = 'L', // QR model
  rotation = 0,
) {
  lines.push(
    `QRCODE ${x},${y},${model},${size},A,${rotation},M${m},S${s},"${data}"`,
  );
}
