
export enum Department {
  Comercial = "Comercial",
  GT = "GT",
  ID = "ID",
  MTS = "MTS",
  Maquinacao = "Maquinacao",
  MTE = "MTE",
  Planamento = "Planamento",
  STM = "STM",
}

export type suggestion = {
  id: string;
  type?: "box" | "connector" | "accessory";
};

export interface QRData {
  id: string;
  source?: "box" | "connector" | "sample";
  refCliente?: string;
  encomenda?: string;
  qty?: number;
}
