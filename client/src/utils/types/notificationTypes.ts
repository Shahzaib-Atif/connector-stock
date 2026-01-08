import { Connector, Sample } from "./types";

export type NotificationStatusType = "idle" | "loading" | "success" | "error";

export type NotificationCompletionType = "fulfilled" | "outOfStock" | "other";

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
