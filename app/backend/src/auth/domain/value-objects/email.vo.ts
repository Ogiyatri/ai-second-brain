import { DomainException } from '../../../shared/exceptions/domain.exception';

export class EmailVO {
  private readonly value: string;

  constructor(email: string) {
    if (!email || !this.isValid(email)) {
      throw new DomainException('Invalid email format');
    }
    this.value = email.toLowerCase().trim();
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toString(): string {
    return this.value;
  }
}
