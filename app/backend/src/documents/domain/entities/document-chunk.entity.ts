export class DocumentChunkEntity {
  constructor(
    public readonly id: string,
    public readonly documentId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly chunkIndex: number,
    public readonly createdAt: Date,
  ) {}
}
