import { User } from '../entities/user.entity';

export interface IUserRepository {
    filedByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
}