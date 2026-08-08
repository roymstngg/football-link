import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ImporterService } from '../importer.service';
import { CareerEnricherService } from '../career-enricher';

async function runMasterImport() {
  console.log('\n==================================================');
  console.log('🚀 STARTING AUTOMATED MASTER FOOTBALL DATA PIPELINE');
  console.log('   Major Leagues: Süper Lig, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga');
  console.log('==================================================\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const importer = app.get(ImporterService);
  const careerEnricher = app.get(CareerEnricherService);

  try {
    // 1. Import Major Leagues & All Teams
    console.log('\n📌 [PHASE 1] Importing Major Leagues & All Official Teams...');
    await importer.importTeams();

    // 2. Import All Squads & Transfer Career Histories
    console.log('\n📌 [PHASE 2] Importing All Players & Transfer Career Histories...');
    await importer.importPlayersAndCareers();

    // 3. Enrich Complete Player Careers
    console.log('\n📌 [PHASE 3] Enriching Complete Player Career Timelines...');
    await careerEnricher.enrichFullCareers();

    console.log('\n==================================================');
    console.log('✨ AUTOMATED MASTER DATA PIPELINE COMPLETED SUCCESSFULLY!');
    console.log('==================================================\n');
  } catch (error) {
    console.error('❌ Error during master import pipeline:', error);
  } finally {
    await app.close();
  }
}

runMasterImport();
