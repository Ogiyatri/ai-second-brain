import { IsString, IsArray, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({ example: 'Apa isi dokumen ini?' })
  @IsString()
  message: string;

  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  document_ids?: string[];

  @ApiProperty({ example: 'session-uuid', required: false })
  @IsOptional()
  @IsUUID('4')
  session_id?: string;
}
