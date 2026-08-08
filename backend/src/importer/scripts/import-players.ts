import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ImporterService } from '../importer.service';

async function run() {
  console.log('🚀 Executing: npm run import:players...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const importer = app.get(ImporterService);

  try {
    await importer.importPlayers();
    console.log('✨ Players import process completed successfully.');
  } catch (error) {
    console.error('❌ Error during import:players:', error);
  } finally {
    await app.close();
  }
}

run();
