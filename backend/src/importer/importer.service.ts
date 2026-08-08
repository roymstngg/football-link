import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiFootballService } from './api-football.service';
import { CareerEnricherService } from './career-enricher';

@Injectable()
export class ImporterService {
  private readonly logger = new Logger(ImporterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly apiFootball: ApiFootballService,
    private readonly careerEnricher: CareerEnricherService,
  ) {}

  async importTeams() {
    this.logger.log('=== STARTING TEAMS & LEAGUES IMPORT ===');

    const countries = await this.apiFootball.getCountries();
    for (const c of countries) {
      if (!c.name) continue;
      await this.prisma.country.upsert({
        where: { name: c.name },
        update: { code: c.code, flag: c.flag },
        create: { name: c.name, code: c.code, flag: c.flag },
      });
    }

    const targetLeagueIds = [203, 140, 39, 135, 78, 61];
    const liveLeagues = await this.apiFootball.getLeagues();

    let importedTeamsCount = 0;

    for (const l of liveLeagues) {
      if (!targetLeagueIds.includes(l.league.id)) continue;

      const country = await this.prisma.country.findUnique({ where: { name: l.country.name } });

      const leagueRecord = await this.prisma.league.upsert({
        where: { apiId: l.league.id },
        update: {
          name: l.league.name,
          type: l.league.type,
          logo: l.league.logo,
          countryId: country?.id,
        },
        create: {
          apiId: l.league.id,
          name: l.league.name,
          type: l.league.type,
          logo: l.league.logo,
          countryId: country?.id,
        },
      });

      const teams = await this.apiFootball.getTeamsByLeague(l.league.id, 2023);
      for (const t of teams) {
        if (!t.team?.id || !t.team?.name) continue;
        const teamCountry = await this.prisma.country.findUnique({ where: { name: t.team.country } });

        await this.prisma.team.upsert({
          where: { apiId: t.team.id },
          update: {
            name: t.team.name,
            code: t.team.code,
            founded: t.team.founded,
            national: t.team.national,
            logo: t.team.logo,
            countryId: teamCountry?.id || country?.id,
            leagueId: leagueRecord.id,
          },
          create: {
            apiId: t.team.id,
            name: t.team.name,
            code: t.team.code,
            founded: t.team.founded,
            national: t.team.national,
            logo: t.team.logo,
            countryId: teamCountry?.id || country?.id,
            leagueId: leagueRecord.id,
            popularRank: 10,
          },
        });
        importedTeamsCount++;
      }
    }

    // Enrich career histories
    await this.careerEnricher.enrichFullCareers();

    this.logger.log(`✅ TEAMS & CAREERS ENRICHED SUCCESSFULLY!`);
  }

  async importPlayersAndCareers() {
    await this.careerEnricher.enrichFullCareers();
  }

  async importPlayers() {
    return this.importPlayersAndCareers();
  }

  async importCareers() {
    return this.importPlayersAndCareers();
  }
}
