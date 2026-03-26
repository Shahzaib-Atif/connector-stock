import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { LoginDto, CreateUserDto, ChangePasswordDto } from 'src/dtos/auth.dto';
import { UserDto } from '@shared/dto/UserDto';
import { UserRoles } from '@shared/enums/UserRoles';

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
  async createUser(
    @Body() body: CreateUserDto,
    @Request() req: { user: UserDto },
  ) {
    const { username, password, role, dept } = body;
    const currentUserRole = req.user.role;

    // Admin can only create 'User' role
    if (currentUserRole === UserRoles.Admin && role !== UserRoles.User) {
      throw new ForbiddenException(
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
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Request() req: { user: { userId: number } },
  ) {
    const { newPassword } = body;
    const userId = req.user.userId;
    return this.authService.updatePassword(userId, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: UserDto }) {
    return req.user;
  }
}
