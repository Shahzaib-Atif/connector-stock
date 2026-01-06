export class UpdateConnectorDto {
  Cor: string;
  Vias: string;
  ConnType: string;
  Fabricante: string;
  Family: number;
  Qty: number;
}

export class ConnectorDto {
  Cor: string;
  Vias: string;
  ConnType: string;
  Qty: number;
  Connectors_Details: {
    Fabricante: string;
    Family: number;
  };
}
