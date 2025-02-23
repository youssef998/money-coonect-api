import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user login requests.
   * 
   * @param body - The request body containing the username and password.
   * @returns The result of the login operation.
   * @throws BadRequestException if the username or password is missing.
   */
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }
    
    return this.authService.login(username, password);
  }
}
