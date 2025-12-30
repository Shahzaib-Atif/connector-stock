import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'src/utils/types';

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

  async create({ username, password, role }: User) {
    try {
      return await this.prisma.users.create({
        data: {
          username,
          password,
          role,
        },
      });
    } catch (ex: any) {
      console.error('Error creating user:', ex.message);
      throw ex;
    }
  }

  async delete(userId: number) {
    try {
      return await this.prisma.users.delete({
        where: { userId },
      });
    } catch (ex: any) {
      console.error('Error deleting user:', ex.message);
      throw ex;
    }
  }

  async updatePassword(userId: number, passwordHash: string) {
    try {
      return await this.prisma.users.update({
        where: { userId },
        data: { password: passwordHash },
      });
    } catch (ex: any) {
      console.error('Error updating password:', ex.message);
      throw ex;
    }
  }
}
