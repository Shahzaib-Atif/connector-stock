import { ConnectorDto } from "@shared/dto/ConnectorDto";
import { SamplesDto } from "@shared/dto/SamplesDto";
import { WireTypes } from "@shared/enums/WireTypes";

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
  CreationDate: string | null;
  ReadDate: string | null;
  FinishedDate: string | null;
  parsedConector?: string;
  parsedEncomenda?: string;
  parsedProdId?: string;
  parsedWireType?: string;
  parsedSample?: string;
  linkedSample?: SamplesDto;
  linkedConnector?: ConnectorDto;
}

export interface FinishNotificationDto {
  notificationId: number;
  quantityTakenOut: number;
  subType?: WireTypes;
  connectorVersionId?: string; // if the connector has versions
  finishedBy?: string;
  completionNote?: string;
}
