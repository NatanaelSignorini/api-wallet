import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RoleType } from 'src/common/decorators/auth.roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Primeiro, execute o guard JWT padrão para autenticação
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    // Obtenha as roles necessárias do contexto
    const roles = this.reflector.get<RoleType[]>('role', context.getHandler());

    // Se não há roles definidas para o handler, permita o acesso
    if (!roles) {
      return true;
    }

    // Se roles é 'ANY', permita o acesso
    if (roles.includes('ANY')) {
      return true;
    }

    // Obtenha o request e o usuário do contexto
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const user = request.user;

    return roles.includes(user?.role?.name) || false;
  }
}
