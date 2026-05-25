import { UserEntity } from '../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../entities/user.typeorm-entity';

export class UserMapper {
  static toDomain(orm: UserTypeOrmEntity): UserEntity {
    return new UserEntity(
      orm.id,
      orm.email,
      orm.password,
      orm.fullName,
      orm.createdAt,
    );
  }

  static toOrm(domain: UserEntity): UserTypeOrmEntity {
    const entity = new UserTypeOrmEntity();
    entity.id = domain.id;
    entity.email = domain.email;
    entity.password = domain.password;
    entity.fullName = domain.fullName;
    return entity;
  }
}
