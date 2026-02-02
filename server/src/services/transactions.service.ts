import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from 'src/dtos/transaction.dto';
import { AccessoryRepo } from 'src/repository/accessories.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { TransactionsRepo } from 'src/repository/transactions.repo';

import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly txRepo: TransactionsRepo,
    private readonly accRepo: AccessoryRepo,
    private readonly connRepo: ConnectorRepo,
  ) {}

  async processTransaction(dto: CreateTransactionsDto, tx?: TransactionClient) {
    const { itemId, transactionType, itemType, subType } = dto;

    // make amount positive or negative
    const amount = transactionType === 'IN' ? dto.amount : dto.amount * -1;

    // update stock of accessory or connector
    await this.updateStock(itemId, amount, itemType, subType, tx);

    // update transactions table
    return await this.txRepo.addTransaction(dto, tx);
  }

  private async updateStock(
    itemId: string,
    amount: number,
    itemType: string,
    subType?: string,
    tx?: TransactionClient,
  ) {
    switch (itemType) {
      case 'accessory':
        await this.handleAccessoryTx(itemId, amount, tx);
        break;
      case 'connector':
        await this.connRepo.update(itemId, amount, subType, tx);
        break;
      default:
        throw new Error('unknown itemType!');
    }
  }

  private async handleAccessoryTx(
    itemId: string,
    amount: number,
    tx?: TransactionClient,
  ) {
    const searchItem = itemId + '.';

    // check if id is valid
    if (!searchItem.includes('_')) throw new Error('Invalid accessory ID!');

    // only one such accessory should be present
    const count = await this.accRepo.findAccessories(searchItem);
    if (count < 1) throw new Error(`Accessory with ${itemId} not found!`);
    if (count > 1)
      throw new Error(`Accessory with ${itemId} returned multiple rows!`);

    // now we can update the accessory with new amount
    return await this.accRepo.update(searchItem, amount, tx);
  }
}
