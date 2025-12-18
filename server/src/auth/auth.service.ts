import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface User {
  id: string;
  username: string;
  role: 'Master Admin' | 'Normal User';
}

@Injectable()
export class AuthService {
  // Hardcoded fake list of users
  private users: User[] = [
    {
      id: '1',
      username: 'admin1',
      role: 'Master Admin',
    },
    {
      id: '2',
      username: 'user1',
      role: 'Normal User',
    },
  ];

  constructor(private jwtService: JwtService) {}

  validateUser(username: string, pass: string): User | null {
    const user = this.users.find((u) => u.username === username);
    if (user) {
      if (pass === user.username) {
        // Simple rule: password is the same as username for now
        const { ...result } = user;
        return result;
      }
    }
    return null;
  }

  login(user: User) {
    const payload = {
      username: user?.username || '',
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  getUsers() {
    return this.users;
  }
}
