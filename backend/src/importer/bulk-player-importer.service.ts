import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiFootballService } from './api-football.service';

@Injectable()
export class BulkPlayerImporterService {
  private readonly logger = new Logger(BulkPlayerImporterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly apiFootball: ApiFootballService,
  ) {}

  /**
   * Bulk Import ALL Players for ALL Teams in PostgreSQL
   */
  async importAllPlayersFromAllTeams() {
    this.logger.log('=== STARTING BULK IMPORT OF ALL PLAYERS ACROSS ALL TEAMS ===');

    const teams = await this.prisma.team.findMany({
      where: { apiId: { not: null } },
      select: { id: true, name: true, apiId: true },
    });

    this.logger.log(`Found ${teams.length} teams with API IDs. Extracting complete player rosters...`);

    let totalPlayersImported = 0;
    let totalCareersLinked = 0;

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      if (!team.apiId) continue;

      this.logger.log(`[${i + 1}/${teams.length}] Fetching squad players for team: "${team.name}" (API ID: ${team.apiId})...`);

      try {
        const squadData = await this.apiFootball.getSquadByTeam(team.apiId);
        if (!squadData || squadData.length === 0) continue;

        for (const item of squadData) {
          const p = item.player;
          if (!p || !p.name) continue;

          const normalized = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          // Upsert Player
          const playerRecord = await this.prisma.player.upsert({
            where: { apiId: p.id },
            update: {
              name: p.name,
              normalizedName: normalized,
              photo: p.photo,
              nationality: p.nationality || p.country || null,
            },
            create: {
              apiId: p.id,
              name: p.name,
              normalizedName: normalized,
              photo: p.photo,
              nationality: p.nationality || p.country || null,
              aliases: [p.name, normalized],
            },
          });

          // Link Career to Team
          await this.prisma.playerCareer.upsert({
            where: {
              playerId_teamId: {
                playerId: playerRecord.id,
                teamId: team.id,
              },
            },
            update: {},
            create: {
              playerId: playerRecord.id,
              teamId: team.id,
            },
          });

          totalPlayersImported++;
          totalCareersLinked++;
        }

        // Small delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch (err) {
        this.logger.error(`Error importing squad for ${team.name}: ${err.message}`);
      }
    }

    this.logger.log(`✅ BULK PLAYER IMPORT COMPLETE! Total Players: ${totalPlayersImported}, Total Careers: ${totalCareersLinked}`);
  }
}
