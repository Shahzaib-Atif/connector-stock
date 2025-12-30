import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from 'src/dtos/transaction.dto';
import { AccessoryRepo } from 'src/repository/accessories.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { TransactionsRepo } from 'src/repository/transactions.repo';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly txRepo: TransactionsRepo,
    private readonly accRepo: AccessoryRepo,
    private readonly connRepo: ConnectorRepo,
  ) {}

  async processTransaction(dto: CreateTransactionsDto) {
    const { itemId, transactionType, itemType } = dto;

    // make amount positive or negative
    const amount = transactionType === 'IN' ? dto.amount : dto.amount * -1;

    // update stock of accessory or connector
    await this.updateStock(itemId, amount, itemType);

    // update transactions table
    return await this.txRepo.addTransaction(dto);
  }

  private async updateStock(itemId: string, amount: number, itemType: string) {
    switch (itemType) {
      case 'accessory':
        await this.handleAccessoryTx(itemId, amount);
        break;
      case 'connector':
        await this.connRepo.update(itemId, amount);
        break;
      default:
        throw new Error('unknown itemType!');
    }
  }

  private async handleAccessoryTx(itemId: string, amount: number) {
    const searchItem = itemId + '.';

    // check if id is valid
    if (!searchItem.includes('_')) throw new Error('Invalid accessory ID!');

    // only one such accessory should be present
    const count = await this.accRepo.findAccessories(searchItem);
    if (count < 1) throw new Error(`Accessory with ${itemId} not found!`);
    if (count > 1)
      throw new Error(`Accessory with ${itemId} returned multiple rows!`);

    // now we can update the accessory with new amount
    return await this.accRepo.update(searchItem, amount);
  }
}
