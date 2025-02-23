import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard) 
  @Post('deposit')
  async deposit(@Req() req, @Body() body: { amount: number,idempotencyKey: string }) {
    const userId = req.user.userId; 
    return this.transactionsService.deposit(userId, body.amount, body.idempotencyKey);
  }
}
