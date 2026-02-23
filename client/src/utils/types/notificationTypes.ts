import type { Connector } from "./inventoryTypes";
import type { Sample } from "./sampleTypes";

export type NotificationStatus = "idle" | "loading" | "success" | "error";

export enum DeliveryStatus {
  Fulfilled = "Fulfilled",
  OutOfStock = "OutOfStock",
  Other = "Other",
}

export interface INotification {
  id: number;
  SenderSector: string;
  SenderUser: string;
  ReceiverUser: string;
  ReceiverSector: string;
  Message: string;
  Read: boolean;
  Title: string | null;
  Finished: boolean;
  CreationDate: string;
  ReadDate: string | null;
  FinishedDate: string | null;
  parsedConector?: string;
  parsedEncomenda?: string;
  parsedProdId?: string;
  parsedWireType?: string;
  linkedSample?: Sample;
  linkedConnector?: Connector;
}
