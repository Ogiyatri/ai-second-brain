import { DomainException } from '../../../shared/exceptions/domain.exception';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export class FileTypeVO {
  private readonly value: string;

  constructor(mimeType: string, originalName: string, sizeBytes: number) {
    if (!ALLOWED_TYPES.includes(mimeType)) {
      const ext = originalName.split('.').pop()?.toLowerCase();
      if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
        throw new DomainException('Only PDF, DOCX, and TXT files are allowed');
      }
    }
    if (sizeBytes > MAX_SIZE_BYTES) {
      throw new DomainException('File size must not exceed 10MB');
    }
    this.value = mimeType;
  }

  toString(): string {
    return this.value;
  }
}
