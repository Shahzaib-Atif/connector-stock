import { Quantity } from '@domain/value-objects/Quantity';
import {
  ConnectorsDetails,
  ConnectorsDimensions,
} from '@shared/dto/ConnectorDto';

export class Connector {
  constructor(
    public readonly id: string,
    public posId: string,
    public color: string,
    public vias: string,
    public type: string,
    public quantity: Quantity,
    public details?: ConnectorsDetails,
    public dimensions?: ConnectorsDimensions,
  ) {}

  hasWires(): boolean {
    return this.quantity.withWire > 0;
  }

  total(): number {
    return this.quantity.total;
  }
}
