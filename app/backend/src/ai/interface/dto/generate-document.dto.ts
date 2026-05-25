import { IsString, IsArray, IsUUID, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateDocumentDto {
  @ApiProperty({ example: 'Buat ringkasan dari dokumen berikut' })
  @IsString()
  prompt: string;

  @ApiProperty({ example: 'ringkasan', enum: ['ringkasan', 'laporan', 'surat', 'proposal'] })
  @IsIn(['ringkasan', 'laporan', 'surat', 'proposal'])
  type: string;

  @ApiProperty({ example: ['uuid-1'], type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  document_ids: string[];
}
