import { User } from '../../domain/entities/user.entity';

export class UserMapper {
    
  static toDomain(raw: any): User {
    return new User({
      id: raw.id,
      email: raw.email,
      password: raw.password,
      roleId: raw.roleId,
      role: raw.role,
      refreshToken: raw.refreshToken,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}