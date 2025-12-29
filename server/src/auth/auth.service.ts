import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepo } from '../repository/users.repo';

export interface User {
  userId: number;
  username: string;
  role: 'Master' | 'Admin' | 'User';
  password?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersRepo: UsersRepo,
  ) {}

  // Validate user credentials
  async validateUser(username: string, pass: string): Promise<User> {
    const user = (await this.usersRepo.findByUsername(username)) as User;
    if (user) {
      const isMatch = await bcrypt.compare(pass, user?.password);
      if (isMatch) {
        const { userId, username, role } = user;
        return {
          userId,
          username,
          role,
        };
      }
      throw new UnauthorizedException('Invalid credentials!');
    }
    throw new UnauthorizedException('User not found!');
  }

  // Generate JWT token for authenticated user
  login(user: User) {
    const payload = {
      username: user?.username || '',
      sub: user.userId,
      userId: user.userId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.userId,
        username: user.username,
        role: user.role,
      },
    };
  }

  getUsers() {
    return this.usersRepo.findAll();
  }
}
