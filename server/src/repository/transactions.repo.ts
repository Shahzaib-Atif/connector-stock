import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTransactionsDto } from 'src/dtos/transaction.dto';
import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';

@Injectable()
export class TransactionsRepo {
  constructor(private prisma: PrismaService) {}

  async getAllTransactions() {
    try {
      return await this.prisma.transactions.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
      });
    } catch (ex: any) {
      console.error(ex.message);
      return [];
    }
  }

  async addTransaction(dto: CreateTransactionsDto, tx?: TransactionClient) {
    try {
      const client = tx || this.prisma;
      return await client.transactions.create({ data: dto });
    } catch (ex) {
      console.error('Failed to add transaction:', ex);
      return null; // at least signals failure
    }
  }
}
