import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

export class LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
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
  @Roles('Master Admin')
  @Post('users')
  createUser() {
    // This is a placeholder for user creation (only Master Admin)
    return {
      message:
        'User creation is not fully implemented in this mock version, but you have permission!',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
