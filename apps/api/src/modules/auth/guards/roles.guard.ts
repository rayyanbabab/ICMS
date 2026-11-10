import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { UserRole, AuthUserTokenPayload } from '@icms/shared';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest() as { user?: AuthUserTokenPayload };

    if (!user || !user.roles) {
      throw new ForbiddenException('Akses ditolak: otorisasi pengguna tidak mencukupi');
    }

    // SUPER_ADMIN has full permissions across all endpoints
    if (user.roles.includes(UserRole.SUPER_ADMIN)) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        `Akses ditolak: Diperlukan peran salah satu dari [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}

