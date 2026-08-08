import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { BulkPlayerImporterService } from '../bulk-player-importer.service';

async function run() {
  console.log('\n==================================================');
  console.log('🚀 STARTING BULK ALL-PLAYERS IMPORT FOR ALL TEAMS IN POSTGRESQL');
  console.log('==================================================\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const bulkImporter = app.get(BulkPlayerImporterService);

  try {
    await bulkImporter.importAllPlayersFromAllTeams();
    console.log('\n✨ BULK ALL-PLAYERS PIPELINE FINISHED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Error during import:all-players:', error);
  } finally {
    await app.close();
  }
}

run();
