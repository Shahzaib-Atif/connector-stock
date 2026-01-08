export interface User {
  userId: number;
  username: string;
  role: UserRoles;
  password?: string;
  dept?: string;
}

export enum UserRoles {
  Master = "Master",
  Admin = "Admin",
  User = "User",
}
