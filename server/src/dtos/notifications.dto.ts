import { WireTypes } from '@shared/enums/WireTypes';

export interface FinishNotificationDto {
  quantityTakenOut: number;
  subType?: WireTypes;
  finishedBy?: string;
  completionNote?: string;
}
