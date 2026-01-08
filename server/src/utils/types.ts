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
