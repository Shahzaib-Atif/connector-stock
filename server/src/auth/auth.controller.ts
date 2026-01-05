import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRoles } from 'src/utils/types';
import { LoginDto, CreateUserDto, ChangePasswordDto } from 'src/dtos/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getUsers() {
    return this.authService.getUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Master', 'Admin')
  @Post('users')
  async createUser(@Body() body: CreateUserDto, @Request() req) {
    const { username, password, role, dept } = body;
    const currentUserRole = req.user.role as UserRoles;

    // Admin can only create 'User' role
    if (currentUserRole === UserRoles.Admin && role !== UserRoles.User) {
      throw new UnauthorizedException(
        'Admins can only create users with "User" role.',
      );
    }

    return this.authService.createUser(username, password, role, dept);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Master')
  @Post('users/delete/:id')
  async deleteUser(@Request() req: any) {
    const userId = parseInt(req.params.id as string);
    return this.authService.deleteUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() body: ChangePasswordDto, @Request() req) {
    const { newPassword } = body;
    const userId = req.user.userId as number;
    return this.authService.updatePassword(userId, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
