import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/modules/users/entities/user.entity';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import * as consts from './../../../common/constants/error.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: User['id']; email: string }): Promise<User> {
    const user = await this.getUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException(consts.USER_UNAUTHORIZED);
    }
    return user;
  }

  private async getUser(id: string) {
    const user = await this.userService.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }
}
