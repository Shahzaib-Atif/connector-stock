import { WireTypes } from '@shared/enums/WireTypes';

export interface FinishNotificationDto {
  quantityTakenOut: number;
  subType?: WireTypes;
  /**
   * Optional connector override (useful for versioned connectors like A255EO-1).
   * When present, stock will be taken out from this exact CODIVMAC.
   */
  connectorId?: string;
  finishedBy?: string;
  completionNote?: string;
}
