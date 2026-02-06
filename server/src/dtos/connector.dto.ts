export class UpdateConnectorDto {
  Cor: string;
  Vias: string;
  ConnType: string;
  Fabricante: string;
  Family: number;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  ActualViaCount?: number;
}

export class ConnectorDto {
  CODIVMAC: string;
  Cor: string;
  Vias: string;
  ConnType: string;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  Connectors_Details: {
    Fabricante: string;
    Family: number;
    ActualViaCount?: number;
  };
}
