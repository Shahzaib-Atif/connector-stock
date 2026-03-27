import { ConnectorsDimensions } from "@shared/dto/ConnectorDto";

export interface ConnectorFormData {
  Cor: string;
  Vias: string;
  ConnType: string;
  Fabricante: string;
  Refabricante: string;
  Family: number;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  ActualViaCount?: number;
  dimensions?: ConnectorsDimensions;
}
