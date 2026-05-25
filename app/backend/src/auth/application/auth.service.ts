import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IAuthRepository } from '../domain/repositories/auth.repository.interface';
import { UserEntity } from '../domain/entities/user.entity';
import { RegisterDto } from '../interface/dto/register.dto';
import { LoginDto } from '../interface/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepo: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.authRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = new UserEntity(
      crypto.randomUUID(),
      dto.email,
      hashed,
      dto.full_name,
      new Date(),
    );
    const saved = await this.authRepo.save(user);
    const token = this.generateToken(saved);
    return { user: this.sanitize(saved), token };
  }

  async login(dto: LoginDto) {
    const user = await this.authRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.generateToken(user);
    return { user: this.sanitize(user), token };
  }

  async getMe(userId: string) {
    const user = await this.authRepo.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return { user: this.sanitize(user) };
  }

  private generateToken(user: UserEntity): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  private sanitize(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
    };
  }
}
