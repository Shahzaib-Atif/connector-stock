export const colorMap = {
  A: "#3b82f6", // Azul
  B: "#ffffff", // Branco
  C: "#6b7280", // Cinza
  D: "#22c55e", // Verde
  E: "#eab308", // Amarelo
  G: "#f5f5dc", // Bege
  I: "#c27803", // Caril
  L: "#f97316", // Laranja
  M: "#9ca3af", // Metal
  N: "#92400e", // Castanho
  O: "#c084fc", // Lilás
  P: "#000000", // Preto
  R: "#7c3aed", // Roxo
  S: "#ec4899", // Rosa
  T: "transparent", // Transparente
  V: "#ef4444", // Vermelho
  X: "linear-gradient(45deg, red, orange, yellow, green, blue, purple)", // Multi
};

export function getColorFromColorMap(colorName: string | undefined): string {
  // Check if colorName is defined and exists in the colorMap
  if (colorName && Object.keys(colorMap).includes(colorName)) {
    return colorMap[colorName as keyof typeof colorMap] || "#64748b"; // Return mapped color or default if not found
  }

  // Else return default gray color for unknown color names
  return "#64748b";
}
