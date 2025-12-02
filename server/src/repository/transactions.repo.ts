import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTransactionsDto } from 'src/utils/types';

@Injectable()
export class TransactionsRepo {
  constructor(private prisma: PrismaService) {}

  async getAllTransactions() {
    try {
      return await this.prisma.transactions.findMany();
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async addTransaction(dto: CreateTransactionsDto) {
    try {
      return await this.prisma.transactions.create({ data: dto });
    } catch (ex) {
      console.error('Failed to add transaction:', ex);
      return null; // at least signals failure
    }
  }
}
