import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../entities/user.typeorm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeOrmUserRepository implements IAuthRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repo: Repository<UserTypeOrmEntity>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const orm = UserMapper.toOrm(user);
    const saved = await this.repo.save(orm);
    return UserMapper.toDomain(saved);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const orm = await this.repo.findOneBy({ email });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? UserMapper.toDomain(orm) : null;
  }
}
