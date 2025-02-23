import { Controller, Post, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Handles user registration requests.
   * 
   * @param body - The request body containing the username, email, name, and password.
   * @returns An object containing a success message and the registered user's details.
   * @throws BadRequestException if any required field is missing or if the username is already taken.
   * @throws InternalServerErrorException if user creation fails.
   */
  @Post('register')
  async register(@Body() body: { username: string;email: string; name: string; password: string }) {
    const { username,email, name, password } = body;

    if (!username || !username || !name || !password) {
      throw new BadRequestException('All fields are required');
    }

    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException('Username already taken');
    }

    const user = await this.usersService.createUser(username, email ,name, password);
    
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    return { 
      message: 'User registered successfully', 
      user: { id: user.id, username: user.username, name: user.name } 
    };
  }
}
