import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ImporterService } from '../importer.service';

async function run() {
  console.log('🚀 Executing: npm run import:career...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const importer = app.get(ImporterService);

  try {
    await importer.importCareers();
    console.log('✨ Career & Transfers import process completed successfully.');
  } catch (error) {
    console.error('❌ Error during import:career:', error);
  } finally {
    await app.close();
  }
}

run();
