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

export enum WireTypes {
  COM_FIO = 'COM_FIO',
  SEM_FIO = 'SEM_FIO',
}

export interface Transaction {
  ID: string;
  itemId: string; // accessory or connector id
  transactionType: 'IN' | 'OUT';
  amount: number;
  itemType: 'connector' | 'accessory';
  subType?: WireTypes;
  encomenda?: string;
  department?: string;
  updatedAt?: number;
  notes?: string;
}
