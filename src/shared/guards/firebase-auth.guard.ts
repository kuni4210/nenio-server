import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Not, Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { adminAuth } from '../firebase/firebase-admin';
// import { UserRole } from '../roles/user.role';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, @InjectRepository(User) private userRepository: Repository<User>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.token;
    if (!token) return false;
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const user: User = await this.userRepository.findOne({
        where: {
          firebaseUid: Equal(decodedToken.uid),
          deletedAt: IsNull(),
        },
      });
      if (!user) throw new ForbiddenException('user/permission-denied');
      const allowedRoles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!allowedRoles) {
        request.user = user;
        return true;
      }
      if (allowedRoles.includes(user.userType)) {
        request.user = user;
        return true;
      } else throw new ForbiddenException('user/permission-denied');
    } catch (error) {
      throw new ForbiddenException('user/permission-denied');
    }
  }
}
