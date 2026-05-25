export class DocumentEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly fileName: string,
    public readonly fileUrl: string,
    public readonly fileType: string,
    public readonly fileSize: number,
    public status: 'processing' | 'ready' | 'error',
    public readonly createdAt: Date,
  ) {}

  markAsReady(): void {
    this.status = 'ready';
  }

  markAsError(): void {
    this.status = 'error';
  }

  isOwner(userId: string): boolean {
    return this.userId === userId;
  }
}
