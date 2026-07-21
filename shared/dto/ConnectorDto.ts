export interface ConnectorDto {
  PosId: string;
  Cor: string;
  Vias: string;
  ConnType: string | null;
  CODIVMAC: string;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  details: ConnectorsDetails | null;
  dimensions: ConnectorsDimensions | null;
  clientReferences: string[];
  version?: number;
}

export interface CreateConnectorDto extends Omit<
  ConnectorDto,
  "CODIVMAC" | "clientReferences"
> {
  LastChangeBy: string;
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
