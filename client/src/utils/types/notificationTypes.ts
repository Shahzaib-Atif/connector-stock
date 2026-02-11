import type { Connector } from "./inventoryTypes";
import type { Sample } from "./sampleTypes";

export type NotificationStatus_T = "idle" | "loading" | "success" | "error";

export type NotificationCompletion_T = "fulfilled" | "outOfStock" | "other";

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
  linkedSample?: Sample | null;
  linkedConnector?: Connector | null;
}
