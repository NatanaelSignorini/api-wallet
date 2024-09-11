import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as consts from './../../common/constants/error.constants';
import { AuthDTO, TokenValidType } from './dto/auth.dto';
import { AuthInput } from './dto/auth.input.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: AuthInput): Promise<AuthDTO> {
    const user: User = await this.userService.findOneUser({
      where: [{ email: data.email }],
      relations: ['role'],
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

    return plainToClass(AuthDTO, { user, token });
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
      const user: User = await this.userService.findOneUser({
        where: { id: tokenContent.sub },
      });
      if (user) {
        return { valid: true };
      }
      return { valid: false };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }
}
