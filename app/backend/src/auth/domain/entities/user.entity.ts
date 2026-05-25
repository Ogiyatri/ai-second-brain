export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly fullName: string,
    public readonly createdAt: Date,
  ) {}

  isOwner(userId: string): boolean {
    return this.id === userId;
  }
}
