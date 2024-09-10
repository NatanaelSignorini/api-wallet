import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as consts from './../../common/constants/error.constants';
import { AuthInput } from './dto/auth.input';
import { AuthType, TokenValidType } from './dto/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: AuthInput): Promise<AuthType> {
    const user: User = await this.userService.findOne({
      where: [{ email: data.email }],
    });

    if (!user) {
      throw new UnauthorizedException(consts.AUTH_LOGIN_ERROR);
    }

    if (!user.password) {
      throw new UnauthorizedException(consts.USER_PASSWORD_EMPTY);
    }

    const isValidPassword = compareSync(data.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException(consts.AUTH_LOGIN_ERROR);
    }

    const token = await this.jwtToken(user);
    this.userService.updateLastLogin(user.id);

    return {
      user,
      token,
    };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<TokenValidType> {
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    });
    try {
      jwtService.verify(token);
      const tokenContent = jwtService.decode(token);
      const user: User = await this.userService.findOne({
        where: { id: tokenContent.sub },
      });
      if (user) {
        return { valid: true };
      }
      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }
}
