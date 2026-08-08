import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiFootballService } from './api-football.service';

@Injectable()
export class DeepHistoricalCrawlerService {
  private readonly logger = new Logger(DeepHistoricalCrawlerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly apiFootball: ApiFootballService,
  ) {}

  /**
   * Deep Crawl Historical Transfers & Squads Across Seasons (2018 - 2026)
   */
  async startDeepHistoricalCrawl() {
    this.logger.log('=== STARTING DEEP SEASON CRAWLER (2018 - 2026) ===');

    const seasons = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
    const targetLeagueIds = [203, 140, 39, 135, 78, 61, 88, 94]; // Süper Lig, La Liga, Premier League, Serie A, Bundesliga, Ligue 1, Eredivisie, Liga Portugal

    let totalPlayersProcessed = 0;
    let totalCareersCreated = 0;

    for (const season of seasons) {
      this.logger.log(`\n📅 --- CRAWLING SEASON ${season} ---`);

      for (const leagueId of targetLeagueIds) {
        this.logger.log(`🌐 Fetching teams for League ID ${leagueId} in Season ${season}...`);
        const teams = await this.apiFootball.getTeamsByLeague(leagueId, season);

        for (const t of teams) {
          if (!t.team?.id) continue;

          // Fetch Transfers for team
          try {
            const transfers = await this.apiFootball.getTransfersByTeam(t.team.id);

            for (const trItem of transfers) {
              const p = trItem.player;
              if (!p || !p.name) continue;

              const normalized = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

              // Upsert Player
              const playerRecord = await this.prisma.player.upsert({
                where: { apiId: p.id },
                update: {
                  name: p.name,
                  normalizedName: normalized,
                },
                create: {
                  apiId: p.id,
                  name: p.name,
                  normalizedName: normalized,
                  aliases: [p.name, normalized],
                },
              });

              // Process transfers array (in / out teams)
              if (trItem.transfers && Array.isArray(trItem.transfers)) {
                for (const tr of trItem.transfers) {
                  const teamIn = tr.teams?.in;
                  const teamOut = tr.teams?.out;

                  if (teamIn && teamIn.id && teamIn.name) {
                    const dbTeamIn = await this.prisma.team.upsert({
                      where: { apiId: teamIn.id },
                      update: { name: teamIn.name, logo: teamIn.logo },
                      create: { apiId: teamIn.id, name: teamIn.name, logo: teamIn.logo },
                    });

                    await this.prisma.playerCareer.upsert({
                      where: { playerId_teamId: { playerId: playerRecord.id, teamId: dbTeamIn.id } },
                      update: {},
                      create: { playerId: playerRecord.id, teamId: dbTeamIn.id },
                    });
                    totalCareersCreated++;
                  }

                  if (teamOut && teamOut.id && teamOut.name) {
                    const dbTeamOut = await this.prisma.team.upsert({
                      where: { apiId: teamOut.id },
                      update: { name: teamOut.name, logo: teamOut.logo },
                      create: { apiId: teamOut.id, name: teamOut.name, logo: teamOut.logo },
                    });

                    await this.prisma.playerCareer.upsert({
                      where: { playerId_teamId: { playerId: playerRecord.id, teamId: dbTeamOut.id } },
                      update: {},
                      create: { playerId: playerRecord.id, teamId: dbTeamOut.id },
                    });
                    totalCareersCreated++;
                  }
                }
              }

              totalPlayersProcessed++;
            }

            // Small delay to respect rate limits
            await new Promise((resolve) => setTimeout(resolve, 200));
          } catch (err) {
            this.logger.error(`Error crawling transfers for team ${t.team.name}: ${err.message}`);
          }
        }
      }
    }

    this.logger.log(`\n🎉 DEEP HISTORICAL CRAWL COMPLETED! Processed Players: ${totalPlayersProcessed}, Careers: ${totalCareersCreated}`);
  }
}
