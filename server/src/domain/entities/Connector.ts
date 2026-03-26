import { ConnectorDetails } from '@domain/value-objects/ConnectorDetails';
import { ConnectorDimensions } from '@domain/value-objects/ConnectorDimensions';
import { Quantity } from '@domain/value-objects/Quantity';

export class Connector {
  constructor(
    public readonly id: string,
    public posId: string,
    public color: string,
    public vias: string,
    public type: string,
    public quantity: Quantity,
    public details?: ConnectorDetails,
    public dimensions?: ConnectorDimensions,
  ) {}

  hasWires(): boolean {
    return this.quantity.withWire > 0;
  }

  total(): number {
    return this.quantity.total;
  }
}
