import { Controller, Get, Body, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from '../application/ai.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';
import { JwtAuthGuard } from '../../auth/interface/auth.guard';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';

@ApiTags('AI')
@ApiBearerAuth('JWT')
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('sessions')
  createSession(@CurrentUser() user: { sub: string }) {
    return this.aiService.createSession(user.sub);
  }

  @Get('sessions')
  listSessions(@CurrentUser() user: { sub: string }) {
    return this.aiService.listSessions(user.sub);
  }

  @Get('sessions/:id/messages')
  getMessages(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.aiService.getMessages(id, user.sub);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('generate')
  generate(
    @CurrentUser() user: { sub: string },
    @Body() dto: GenerateDocumentDto,
  ) {
    return this.aiService.generate(
      user.sub,
      dto.prompt,
      dto.type,
      dto.document_ids,
    );
  }
}
