import { Injectable, Logger } from '@nestjs/common';
import { AccessoryRepo } from 'src/repository/accessories.repo';
import { ConnectorRepo } from 'src/repository/connectors.repo';
import { TransactionsRepo } from 'src/repository/transactions.repo';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TransactionClient } from 'src/generated/prisma/internal/prismaNamespace';
import { CreateTransactionsDto } from '@shared/types/Transaction';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

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
    if (itemType === 'connector')
      await this.connRepo.updateQty(itemId, amount, subType, tx);
    else if (itemType === 'accessory') {
      if (isNaN(Number(itemId)))
        throw new Error('Accessory Id should be a valid number!');
      await this.accRepo.update(parseInt(itemId), amount, tx);
    } else throw new Error('Unknown item type at processTransaction');

    // update transactions table
    return await this.txRepo.addTransaction(dto, tx);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleAutoUpdateDeliveryStatuses() {
    try {
      const updatedCount = await this.txRepo.updateExpiredDeliveryStatuses(30);
      if (updatedCount > 0) {
        this.logger.log(
          `Auto-updated ${updatedCount} notifications from 'Delivery in progress' to 'Delivered'`,
        );
      } else
        this.logger.log(`No notifications needed auto-updating at this time.`);
    } catch (error) {
      this.logger.error('Failed to auto-update notification statuses:', error);
    }
  }
}
