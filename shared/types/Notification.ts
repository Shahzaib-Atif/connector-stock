import { SamplesDto } from "../dto/SamplesDto";
import { ConnectorDto } from "../dto/ConnectorDto";

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
