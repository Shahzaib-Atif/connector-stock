import { SamplesDto } from "@shared/dto/SamplesDto";
import { ConnectorDto } from "@shared/dto/ConnectorDto";

export type NotificationStatus = "idle" | "loading" | "success" | "error";

export enum DeliveryStatus {
  Fulfilled = "Fulfilled",
  OutOfStock = "OutOfStock",
  Other = "Other",
}
