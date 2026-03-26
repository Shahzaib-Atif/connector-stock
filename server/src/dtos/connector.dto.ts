export class UpdateConnectorDto {
  Cor?: string;
  Vias?: string;
  ConnType?: string;
  Fabricante?: string;
  Refabricante?: string;
  Family?: number;
  Qty?: number;
  Qty_com_fio?: number;
  Qty_sem_fio?: number;
  ActualViaCount?: number;
  // Optional physical dimensions payload (used e.g. for \"olhal\" type)
  dimensions?: {
    InternalDiameter?: number;
    ExternalDiameter?: number;
    Thickness?: number;
  };
}
