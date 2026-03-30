export interface ConnectorDto {
  PosId: string;
  Cor: string;
  Vias: string;
  CODIVMAC: string;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  ConnType: string | null;
  details: ConnectorsDetails | null;
  dimensions: ConnectorsDimensions | null;
  clientReferences: string[];
}

export interface ConnectorsDetails {
  Family: number;
  Fabricante: string | null;
  ActualViaCount: number | null;
  Designacao?: string;
  Refabricante: string | null;
  OBS: string | null;
  ClipColor: string | null;
  CapotAngle: string | null;
}

export interface ConnectorsDimensions {
  InternalDiameter: number | null;
  ExternalDiameter: number | null;
  Thickness: number | null;
}
