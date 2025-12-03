import { Injectable } from '@nestjs/common';
import { AccessoryRepo } from 'src/repository/accessories.repo';
import { TransactionsRepo } from 'src/repository/transactions.repo';
import { CreateTransactionsDto } from 'src/utils/types';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly txRepo: TransactionsRepo,
    private readonly accRepo: AccessoryRepo,
  ) {}

  async processTransaction(dto: CreateTransactionsDto) {
    const { itemId, transactionType } = dto;
    const amount = transactionType === 'IN' ? dto.amount : dto.amount * -1;

    // update stock
    if (dto.itemType === 'accessory')
      await this.handleAccessoryTx(itemId, amount);

    // update transactions table
    return await this.txRepo.addTransaction(dto);
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
