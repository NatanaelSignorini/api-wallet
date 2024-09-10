import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RoleType } from 'src/common/decorators/auth.roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext): Request {
    const httpContext = context.switchToHttp();
    return httpContext.getRequest();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    await super.canActivate(context);

    if (roles.includes('ANY')) {
      return true;
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const userRoles = request.user?.roles.map((userRole) => userRole.name);

    return userRoles.some((userRole) => roles.includes(userRole));
  }
}
