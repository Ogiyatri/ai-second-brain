import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserTypeOrmEntity } from './infrastructure/entities/user.typeorm-entity';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { AuthService } from './application/auth.service';
import { AuthController } from './interface/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ||
            '1d') as unknown as number,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: 'IAuthRepository', useClass: TypeOrmUserRepository },
  ],
  controllers: [AuthController],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
