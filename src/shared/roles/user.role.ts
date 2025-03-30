import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
