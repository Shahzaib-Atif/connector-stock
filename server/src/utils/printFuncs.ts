// Utility functions for generating TSPL commands for label printing
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
