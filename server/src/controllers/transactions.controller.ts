import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TransactionsRepo } from 'src/repository/transactions.repo';
import { TransactionsService } from 'src/services/transactions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTransactionsDto } from 'src/dtos/transaction.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post('')
  async addTransaction(@Body() dto: CreateTransactionsDto) {
    return await this.service.processTransaction(dto);
  }
}
