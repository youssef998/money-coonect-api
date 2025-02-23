import { Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';  // Ensure bcrypt is imported
import { UsersService } from '../users/users.service';
import { User as UserType } from '../users/users.service';

interface User {
  id: number;
  username: string;
  name: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<{ access_token: string; user: Omit<UserType, 'password'> }> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
        throw new UnauthorizedException('Invalid username'); // ✅ Use this instead of `Error`
      }
      if (!user || !user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid Password'); // ✅ Use this instead of `Error`
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        balance: user.balance,
      }, // ✅ Correctly omitting password
    };
  }
}
