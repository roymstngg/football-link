import { Module } from '@nestjs/common';
import { ApiFootballService } from './api-football.service';
import { ImporterService } from './importer.service';
import { CareerEnricherService } from './career-enricher';
import { TransfermarktService } from './transfermarkt.service';
import { BulkPlayerImporterService } from './bulk-player-importer.service';
import { DeepHistoricalCrawlerService } from './deep-historical-crawler.service';

@Module({
  providers: [
    ApiFootballService,
    ImporterService,
    CareerEnricherService,
    TransfermarktService,
    BulkPlayerImporterService,
    DeepHistoricalCrawlerService,
  ],
  exports: [
    ApiFootballService,
    ImporterService,
    CareerEnricherService,
    TransfermarktService,
    BulkPlayerImporterService,
    DeepHistoricalCrawlerService,
  ],
})
export class ImporterModule {}
