import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DeepHistoricalCrawlerService } from '../deep-historical-crawler.service';

async function run() {
  console.log('\n==================================================');
  console.log('🚀 STARTING DEEP HISTORICAL SEASON CRAWLER (2018 - 2023)');
  console.log('==================================================\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const crawler = app.get(DeepHistoricalCrawlerService);

  try {
    await crawler.startDeepHistoricalCrawl();
    console.log('\n✨ DEEP HISTORICAL CRAWL FINISHED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Error during import:deep-history:', error);
  } finally {
    await app.close();
  }
}

run();
