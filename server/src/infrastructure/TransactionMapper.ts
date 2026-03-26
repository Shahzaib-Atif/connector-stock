import { TransactionsCreateInput } from 'src/generated/prisma/models';
import { CreateTransactionsDto } from '@shared/types/Transaction';

export class TransactionMapper {
  static toPrismaCreate(
    transaction: CreateTransactionsDto,
  ): TransactionsCreateInput {
    return {
      amount: transaction.amount,
      itemId: transaction.itemId,
      itemType: transaction.itemType,
      transactionType: transaction.transactionType,
      department: transaction.department,
      encomenda: transaction.encomenda,
      notes: transaction.notes,
      sender: transaction.sender,
      subType: transaction.subType,
    };
  }
}
