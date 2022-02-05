import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

export interface ILoginResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<ILoginResponse> {
    const user = this.validate(email, password);

    const payload = { sub: user.id, username: user.name };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validate(email: string, password: string): User {
    const user = this.usersService.findByEmail(email);

    if (!user) {
      throw new Error('User or password incorrect');
    }

    const PasswordMatch = compareSync(password, user.password);

    if (!PasswordMatch) {
      throw new Error('User or password incorrect');
    }

    return user;
  }
}
