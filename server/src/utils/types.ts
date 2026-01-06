export enum UserRoles {
  Master = 'Master',
  Admin = 'Admin',
  User = 'User',
}

export interface User {
  userId: number;
  username: string;
  role: 'Master' | 'Admin' | 'User';
  password?: string;
  dept?: string;
}

export interface Connector {
  id: string; // e.g., A255PR (6 chars)
  posId: string; // e.g., A255 (4 chars)
  colorCode: string; // e.g., P
  viasCode: string; // e.g., R
  colorName: string;
  colorNamePT: string;
  viasName: string;
  cv: string; // Vertical Coordinate
  ch: string; // Horizontal Coordinate
  fabricante: string;
  refabricante: string;
  type: string;
  description: string;
  stock: number;
  family?: number;
  accessories: any[]; // Linked accessories
  clientReferences?: string[]; // Legacy mappings (RefMARCA)
}
