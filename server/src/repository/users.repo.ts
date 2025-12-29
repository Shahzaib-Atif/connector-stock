import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersRepo {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    try {
      return await this.prisma.users.findFirst({
        where: {
          username: username,
        },
      });
    } catch (ex: any) {
      console.error('Error finding user by username:', ex.message);
      return null;
    }
  }

  async findAll() {
    try {
      return await this.prisma.users.findMany({
        select: {
          userId: true,
          username: true,
          role: true,
          // Exclude password from general list matches
        },
      });
    } catch (ex: any) {
      console.error('Error fetching users:', ex.message);
      return [];
    }
  }
}
