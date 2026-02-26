import { Connector_Dimensions } from "@/utils/types";

export interface ConnectorFormData {
  Cor: string;
  Vias: string;
  ConnType: string;
  Fabricante: string;
  Family: number;
  Qty: number;
  Qty_com_fio: number;
  Qty_sem_fio: number;
  ActualViaCount?: number;
  dimensions?: Connector_Dimensions;
}
