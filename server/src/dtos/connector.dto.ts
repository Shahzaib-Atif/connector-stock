import { WireTypes } from '@shared/enums/WireTypes';

export interface UpdateConnectorDto {
  codivmac: string;
  quantityTakenOut: number;
  subType: WireTypes;
  updatedBy: string;
}
