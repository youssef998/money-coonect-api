import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module'; // ✅ Import TransactionsModule
@Module({
  imports: [AuthModule, UsersModule, TransactionsModule], // ✅ Ensure both modules are included
})
export class AppModule {}
