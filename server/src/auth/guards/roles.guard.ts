import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from 'src/utils/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // no roles are required: everyone gets through
    if (!requiredRoles) return true;

    // if role is required, then first check user is present with request
    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    if (!user) throw new UnauthorizedException(); // 401

    // make sure this role is allowed to get access
    const hasRole = requiredRoles.some((role) => user?.role === role);
    if (!hasRole) throw new ForbiddenException(); // 403
  }
}
