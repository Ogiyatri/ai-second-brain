import { UserEntity } from '../entities/user.entity';

export interface IAuthRepository {
  save(user: UserEntity): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}
