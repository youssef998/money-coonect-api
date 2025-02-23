import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, DatabaseService],
})
export class TransactionsModule {}
