import { UserRoles } from 'src/utils/types';

export class LoginDto {
  username: string;
  password: string;
}

export class CreateUserDto {
  username: string;
  password: string;
  role: UserRoles;
}

export class ChangePasswordDto {
  newPassword: string;
}
