import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserTypeOrmEntity } from 'src/auth/infrastructure/entities/user.typeorm-entity';

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const repo = this.dataSource.getRepository(UserTypeOrmEntity);

    const users = [
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Admin User',
      },
      {
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Test User',
      },
    ];

    for (const user of users) {
      const exists = await repo.findOneBy({ email: user.email });
      if (!exists) {
        await repo.save(repo.create(user));
        console.log(`✅ Seeded user: ${user.email}`);
      }
    }
  }
}
