import { Injectable ,ConflictException,InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database.service';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  password?: string;
  balance: number; 
}


@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Creates a new user with the provided details.
   * 
   * @param username - The username of the new user.
   * @param email - The email of the new user.
   * @param name - The name of the new user.
   * @param password - The password of the new user.
   * @returns The created user object or null if creation fails.
   * @throws ConflictException if the email is already in use.
   * @throws InternalServerErrorException if user creation fails.
   */
  async createUser(username: string, email: string, name: string, password: string): Promise<User | null> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO users (username, email, name, password) VALUES ($1, $2, $3, $4) RETURNING *`;
      const result: User[] = await this.db.query(sql, [username, email, name, hashedPassword]);
      return result[0] ?? null;
    } catch (error) {
      if (error.code === '23505') { 
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException(`Error creating user: ${error.message}`);
    }
  }
  
  /**
   * Finds a user by their username.
   * 
   * @param username - The username of the user to find.
   * @returns The user object or null if the user is not found.
   * @throws Error if fetching the user fails.
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const sql = `SELECT * FROM users WHERE username = $1`;
      const result: User[] = await this.db.query(sql, [username]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  /**
   * Validates a user's credentials.
   * 
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns The user object if the credentials are valid, otherwise null.
   */
  async validateUser(username: string, password: string) {
    const user = await this.db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (!user) return null; 

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return null; 

    return {
      id: user[0].id,
      username: user[0].username,
      email: user[0].email,
      name: user[0].name,
    };
  }
  
}
