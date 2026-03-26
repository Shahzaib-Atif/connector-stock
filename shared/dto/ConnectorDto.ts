export interface ConnectorDto {
  PosId: string;
  Cor: string;
  Vias: string;
  CODIVMAC: string;
  ConnType: string | null;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  Connectors_Details?: ConnectorsDetailsI;
  Connectors_Dimensions?: ConnectorsDimensionsI;
}

export interface ConnectorsDetailsI {
  Family: number;
  Fabricante?: string;
  ActualViaCount?: number;
}

export interface ConnectorsDimensionsI {
  InternalDiameter?: number;
  ExternalDiameter?: number;
  Thickness?: number;
}
