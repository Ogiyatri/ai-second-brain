import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seeder';
import { AppDataSource } from '../typeorm.config';

export async function runSeeders(dataSource: DataSource): Promise<void> {
  if (process.env.SEED_ON_START !== 'true') {
    console.log('⏭️  SEED_ON_START is not true, skipping seeders.');
    return;
  }

  console.log('🌱 Running seeders...');
  await new UserSeeder(dataSource).run();
  console.log('✅ Seeders done.');
}

// Manual run: yarn seed
if (require.main === module) {
  AppDataSource.initialize()
    .then((dataSource) => runSeeders(dataSource))
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeder error:', err);
      process.exit(1);
    });
}
