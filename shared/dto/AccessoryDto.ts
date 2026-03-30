export interface AccessoryDto {
  Id: number; // e.g., A255PR_1024
  customId: string; // e.g., A255PR_1024
  AccessoryType: string;
  CapotAngle: string | null;
  ClipColor: string | null;
  ConnName: string;
  AccImagePath: string;
  Qty: number;
  RefClient: string | null;
  RefDV: string | null;
  // posId: string | null; // e.g. A255
  // connectorId: string | null; // Reference to parent connector
  ColorAssociated: boolean | null;
}
