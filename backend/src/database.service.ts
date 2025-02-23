import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'myuser', // ✅ Use your new user
      password: 'postgresspassword', // ✅ Use the password you set
      database: 'mydatabase', // ✅ Use the new database
    });
  }

  async onModuleInit() {
    await this.pool.connect();
    console.log('Connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.log('PostgreSQL connection closed');
  }

  async query<T>(sql: string, params?: any[]): Promise<T> {
    const { rows } = await this.pool.query(sql, params);
    return rows;
  }
  async runQuery(query: string, params: any[] = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
