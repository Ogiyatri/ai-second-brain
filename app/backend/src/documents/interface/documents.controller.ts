import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DocumentsService } from '../application/documents.service';
import { JwtAuthGuard } from '../../auth/interface/auth.guard';
import { CurrentUser } from '../../auth/interface/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Documents')
@ApiBearerAuth('JWT')
@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  upload(
    @CurrentUser() user: { sub: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.upload(user.sub, file);
  }

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.documentsService.list(user.sub);
  }

  @Get(':id')
  getById(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.documentsService.getById(user.sub, id);
  }

  @Delete(':id')
  delete(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.documentsService.delete(user.sub, id);
  }
}
