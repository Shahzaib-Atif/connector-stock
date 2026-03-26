import { UserRoles } from '@shared/enums/UserRoles';

export interface LoginDto {
  username: string;
  password: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  role: UserRoles;
  dept?: string;
}

export interface ChangePasswordDto {
  newPassword: string;
}
