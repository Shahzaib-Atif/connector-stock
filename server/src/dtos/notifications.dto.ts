import { UpdateSampleDto } from './samples.dto';

export interface AppNotification {
  id: number;
  SenderSector: string;
  SenderUser: string;
  ReceiverUser: string;
  ReceiverSector: string;
  Message: string;
  Read: boolean;
  Title: string | null;
  Finished: boolean;
  CreationDate: Date;
  ReadDate: Date | null;
  FinishedDate: Date | null;
}

export interface FinishNotificationDto {
  quantityTakenOut: number;
  finishedBy?: string;
}

export interface NotificationWithParsedData extends AppNotification {
  // Parsed fields
  parsedConector?: string;
  parsedEncomenda?: string;
}

export interface NotificationWithSample extends NotificationWithParsedData {
  linkedSample?: UpdateSampleDto | null;
}
