import { Module } from '@nestjs/common';
import { AiService } from './application/ai.service';
import { AiController } from './interface/ai.controller';
import { AiInfrastructureModule } from './infrastructure/ai-infrastructure.module';
import { ChatGateway } from './interface/chat.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AiInfrastructureModule, AuthModule],
  providers: [AiService, ChatGateway],
  controllers: [AiController],
})
export class AiModule {}
