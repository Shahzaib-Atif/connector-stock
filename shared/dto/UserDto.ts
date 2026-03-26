import { UserRoles } from "../enums/UserRoles";

export interface UserDto {
  userId: number;
  username: string;
  role: UserRoles;
  password?: string;
  dept?: string;
}
