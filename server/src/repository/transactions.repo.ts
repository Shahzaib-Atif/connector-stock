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

  /**
   * Find and update transactions that have been in "Delivery in progress" status
   * for more than the specified minutes.
   */
  async updateExpiredDeliveryStatuses(minutes: number): Promise<number> {
    const threshold = new Date(Date.now() - minutes * 60 * 1000);

    try {
      // Find transactions that were finished more than X minutes ago and have the status "Delivery in progress"
      const transactions = await this.prisma.transactions.findMany({
        where: {
          transactionType: 'OUT',
          notes: {
            contains: 'Delivery in progress',
          },
          updatedAt: {
            lt: threshold,
          },
        },
      });

      if (transactions.length === 0) return 0;

      // Update each one to "Delivered" while preserving any custom notes
      for (const transaction of transactions) {
        if (!transaction.notes) continue;

        await this.prisma.transactions.update({
          where: { ID: transaction.ID },
          data: {
            notes: 'Delivered',
          },
        });
      }

      return transactions.length;
    } catch (ex: any) {
      console.error('Failed to update expired delivery statuses:', ex.message);
      return 0;
    }
  }
}
