import { UserRoles } from 'src/utils/types';

export class LoginDto {
  username: string;
  password: string;
}

export class CreateUserDto {
  username: string;
  password: string;
  role: UserRoles;
  dept?: string;
}

export class ChangePasswordDto {
  newPassword: string;
}
