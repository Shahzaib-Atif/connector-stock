import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsRepo } from 'src/repository/transactions.repo';
import { TransactionsService } from 'src/services/transactions.service';
import { CreateTransactionsDto } from 'src/utils/types';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly repo: TransactionsRepo,
    private readonly service: TransactionsService,
  ) {}

  @Get('')
  async getAllTransactions() {
    return await this.repo.getAllTransactions();
  }

  @Post('')
  async addTransaction(@Body() dto: CreateTransactionsDto) {
    return await this.service.processTransaction(dto);
  }
}
