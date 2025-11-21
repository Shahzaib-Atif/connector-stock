import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DBService {
  constructor(private prisma: PrismaService) {}

  async getCors() {
    try {
      return await this.prisma.cores.findMany();
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }
}
