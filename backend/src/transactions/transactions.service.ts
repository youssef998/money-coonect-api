import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly db: DatabaseService) {}
  
  /**
   * Handles deposit transactions.
   * 
   * @param userId - The ID of the user making the deposit.
   * @param amount - The amount to be deposited.
   * @param idempotencyKey - A unique key to prevent duplicate transactions.
   * @returns An object containing the result of the deposit operation.
   * @throws BadRequestException if the deposit amount is less than or equal to zero or if the deposit fails.
   */
  async deposit(userId: number, amount: number, idempotencyKey: string) {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero');
    }
  
    await this.db.runQuery('BEGIN');
  
    try {
      const existingTransaction = await this.db.runQuery(
        'SELECT * FROM transactions WHERE idempotency_key = $1',
        [idempotencyKey]
      );
      console.log(`Existing transaction check:`, existingTransaction);
      if (existingTransaction.length > 0) {
        await this.db.runQuery('ROLLBACK');
        return { message: 'Duplicate deposit prevented', amount };
      }
  
      // Insert transaction record with idempotency key
      await this.db.runQuery(
        'INSERT INTO transactions (user_id, amount, type, idempotency_key) VALUES ($1, $2, $3, $4)',
        [userId, amount, 'deposit', idempotencyKey]
      );
  
      console.log(`Depositing ${amount} for user ID: ${userId}`);
  
      // Update user balance
      await this.db.runQuery(
        'UPDATE users SET balance = balance + $1 WHERE id = $2',
        [amount, userId]
      );
  
      await this.db.runQuery('COMMIT');
      return { message: 'Deposit successful', amount };
    } catch (error) {
      await this.db.runQuery('ROLLBACK');
      throw new BadRequestException('Deposit failed');
    }
  }
  
}