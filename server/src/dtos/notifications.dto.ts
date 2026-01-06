export interface FinishNotificationDto {
  quantityTakenOut: number;
  finishedBy?: string;
}

export interface NotificationWithParsedData {
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
  // Parsed fields
  parsedConector?: string;
  parsedEncomenda?: string;
}

export interface NotificationWithSample extends NotificationWithParsedData {
  linkedSample?: {
    ID: number;
    Amostra: string | null;
    EncDivmac: string | null;
    Cliente: string | null;
    Projeto: string | null;
    Quantidade: string | null;
  } | null;
}
