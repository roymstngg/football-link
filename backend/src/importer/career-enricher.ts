import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CompletePlayerCareerData {
  name: string;
  aliases: string[];
  nationality?: string;
  teams: string[]; // List of team names in chronological order
}

@Injectable()
export class CareerEnricherService {
  private readonly logger = new Logger(CareerEnricherService.name);

  constructor(private readonly prisma: PrismaService) {}

  async enrichFullCareers() {
    this.logger.log('=== ENRICHING COMPLETE CAREER HISTORIES FOR ALL PLAYERS ===');

    const fullCareers: CompletePlayerCareerData[] = [
      {
        name: 'Burak Yilmaz',
        aliases: ['Burak Yılmaz', 'Burak', 'Yilmaz'],
        nationality: 'Turkey',
        teams: ['Antalyaspor', 'Besiktas', 'Fenerbahce', 'Trabzonspor', 'Galatasaray', 'Lille', 'Fortuna Sittard'],
      },
      {
        name: 'Arda Turan',
        aliases: ['Arda', 'Turan'],
        nationality: 'Turkey',
        teams: ['Galatasaray', 'Atletico Madrid', 'Barcelona', 'Istanbul Basaksehir'],
      },
      {
        name: 'Alex de Souza',
        aliases: ['Alex', 'Alex De Souza'],
        nationality: 'Brazil',
        teams: ['Coritiba', 'Palmeiras', 'Parma', 'Cruzeiro', 'Fenerbahce'],
      },
      {
        name: 'Hakan Calhanoglu',
        aliases: ['Hakan Çalhanoğlu', 'Calhanoglu', 'Çalhanoğlu'],
        nationality: 'Turkey',
        teams: ['Hamburger SV', 'Bayer Leverkusen', 'AC Milan', 'Inter Milan'],
      },
      {
        name: 'Cenk Tosun',
        aliases: ['Cenk', 'Tosun'],
        nationality: 'Turkey',
        teams: ['Gaziantepspor', 'Besiktas', 'Everton', 'Crystal Palace', 'Fenerbahce'],
      },
      {
        name: 'Ryan Babel',
        aliases: ['Babel', 'Ryan'],
        nationality: 'Netherlands',
        teams: ['Ajax', 'Liverpool', 'VfL Wolfsburg', 'Besiktas', 'Fulham', 'Galatasaray'],
      },
      {
        name: 'Michy Batshuayi',
        aliases: ['Batshuayi', 'Michy'],
        nationality: 'Belgium',
        teams: ['Marseille', 'Chelsea', 'Borussia Dortmund', 'Valencia', 'Crystal Palace', 'Besiktas', 'Fenerbahce', 'Galatasaray'],
      },
      {
        name: 'Emre Belozoglu',
        aliases: ['Emre Belözoğlu', 'Emre'],
        nationality: 'Turkey',
        teams: ['Galatasaray', 'Inter Milan', 'Newcastle', 'Fenerbahce', 'Atletico Madrid', 'Istanbul Basaksehir'],
      },
      {
        name: 'Caner Erkin',
        aliases: ['Caner', 'Erkin'],
        nationality: 'Turkey',
        teams: ['CSKA Moscow', 'Galatasaray', 'Fenerbahce', 'Inter Milan', 'Besiktas', 'Istanbul Basaksehir'],
      },
      {
        name: 'Mehmet Topal',
        aliases: ['Mehmet', 'Topal'],
        nationality: 'Turkey',
        teams: ['Galatasaray', 'Valencia', 'Fenerbahce', 'Istanbul Basaksehir', 'Besiktas'],
      },
      {
        name: 'Gokhan Gonul',
        aliases: ['Gökhan Gönül', 'Gökhan', 'Gonul'],
        nationality: 'Turkey',
        teams: ['Fenerbahce', 'Besiktas'],
      },
      {
        name: 'Semih Senturk',
        aliases: ['Semih Şentürk', 'Semih'],
        nationality: 'Turkey',
        teams: ['Fenerbahce', 'Antalyaspor', 'Istanbul Basaksehir'],
      },
      {
        name: 'Volkan Demirel',
        aliases: ['Volkan', 'Demirel'],
        nationality: 'Turkey',
        teams: ['Fenerbahce'],
      },
      {
        name: 'Selcuk Inan',
        aliases: ['Selçuk İnan', 'Selcuk'],
        nationality: 'Turkey',
        teams: ['Manisaspor', 'Trabzonspor', 'Galatasaray'],
      },
      {
        name: 'Yusuf Yazici',
        aliases: ['Yusuf Yazıcı', 'Yusuf'],
        nationality: 'Turkey',
        teams: ['Trabzonspor', 'Lille', 'CSKA Moscow'],
      },
      {
        name: 'Mesut Ozil',
        aliases: ['Mesut Özil', 'Mesut', 'Ozil'],
        nationality: 'Germany',
        teams: ['Schalke 04', 'Werder Bremen', 'Real Madrid', 'Arsenal', 'Fenerbahce', 'Istanbul Basaksehir'],
      },
      {
        name: 'Roberto Carlos',
        aliases: ['Carlos', 'Roberto'],
        nationality: 'Brazil',
        teams: ['Palmeiras', 'Inter Milan', 'Real Madrid', 'Fenerbahce'],
      },
      {
        name: 'Nicolas Anelka',
        aliases: ['Anelka'],
        nationality: 'France',
        teams: ['Paris Saint Germain', 'Arsenal', 'Real Madrid', 'Liverpool', 'Manchester City', 'Fenerbahce', 'Chelsea', 'Juventus'],
      },
      {
        name: 'Gheorghe Hagi',
        aliases: ['Hagi', 'Gica Hagi'],
        nationality: 'Romania',
        teams: ['Real Madrid', 'Brescia', 'Barcelona', 'Galatasaray'],
      },
      {
        name: 'Gheorghe Popescu',
        aliases: ['Popescu'],
        nationality: 'Romania',
        teams: ['PSV Eindhoven', 'Tottenham', 'Barcelona', 'Galatasaray', 'Lecce'],
      },
      {
        name: 'Claudio Taffarel',
        aliases: ['Taffarel'],
        nationality: 'Brazil',
        teams: ['Parma', 'Galatasaray', 'Atletico Mineiro'],
      },
      {
        name: 'Lukas Podolski',
        aliases: ['Podolski', 'Poldi'],
        nationality: 'Germany',
        teams: ['Bayern Munich', 'Arsenal', 'Inter Milan', 'Galatasaray', 'Antalyaspor'],
      },
      {
        name: 'Wesley Sneijder',
        aliases: ['Sneijder', 'Wesley'],
        nationality: 'Netherlands',
        teams: ['Ajax', 'Real Madrid', 'Inter Milan', 'Galatasaray', 'Nice'],
      },
      {
        name: 'Didier Drogba',
        aliases: ['Drogba'],
        nationality: 'Ivory Coast',
        teams: ['Marseille', 'Chelsea', 'Galatasaray'],
      },
      {
        name: 'Robin van Persie',
        aliases: ['Van Persie', 'RVP'],
        nationality: 'Netherlands',
        teams: ['Feyenoord', 'Arsenal', 'Manchester United', 'Fenerbahce'],
      },
      {
        name: 'Mauro Icardi',
        aliases: ['Icardi', 'Mauro'],
        nationality: 'Argentina',
        teams: ['Sampdoria', 'Inter Milan', 'Paris Saint Germain', 'Galatasaray'],
      },
      {
        name: 'Edin Dzeko',
        aliases: ['Dzeko', 'Edin'],
        nationality: 'Bosnia and Herzegovina',
        teams: ['VfL Wolfsburg', 'Manchester City', 'AS Roma', 'Inter Milan', 'Fenerbahce'],
      },
      {
        name: 'Dries Mertens',
        aliases: ['Mertens'],
        nationality: 'Belgium',
        teams: ['PSV Eindhoven', 'Napoli', 'Galatasaray'],
      },
      {
        name: 'Lucas Torreira',
        aliases: ['Torreira'],
        nationality: 'Uruguay',
        teams: ['Sampdoria', 'Arsenal', 'Atletico Madrid', 'Fiorentina', 'Galatasaray'],
      },
      {
        name: 'Fred',
        aliases: ['Frederico Rodrigues'],
        nationality: 'Brazil',
        teams: ['Shakhtar Donetsk', 'Manchester United', 'Fenerbahce'],
      },
      {
        name: 'Sebastian Szymanski',
        aliases: ['Szymanski'],
        nationality: 'Poland',
        teams: ['Legia Warsaw', 'Dynamo Moscow', 'Feyenoord', 'Fenerbahce'],
      },
      {
        name: 'Dusan Tadic',
        aliases: ['Tadic', 'Dušan Tadić'],
        nationality: 'Serbia',
        teams: ['Groningen', 'Twente', 'Southampton', 'Ajax', 'Fenerbahce'],
      },
    ];

    let updatedCount = 0;

    for (const item of fullCareers) {
      const normalized = item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      // Find or create player
      let player = await this.prisma.player.findFirst({
        where: {
          OR: [
            { normalizedName: normalized },
            { name: { contains: item.name.split(' ')[0], mode: 'insensitive' } },
          ],
        },
      });

      if (!player) {
        player = await this.prisma.player.create({
          data: {
            name: item.name,
            normalizedName: normalized,
            nationality: item.nationality,
            aliases: [item.name, normalized, ...item.aliases],
          },
        });
      }

      // Link every team in chronological career order
      for (const teamName of item.teams) {
        let team = await this.prisma.team.findFirst({
          where: { name: { contains: teamName, mode: 'insensitive' } },
        });

        if (!team) {
          team = await this.prisma.team.create({
            data: {
              name: teamName,
              logo: 'https://media.api-sports.io/football/teams/541.png',
            },
          });
        }

        await this.prisma.playerCareer.upsert({
          where: { playerId_teamId: { playerId: player.id, teamId: team.id } },
          update: {},
          create: {
            playerId: player.id,
            teamId: team.id,
          },
        });
      }
      updatedCount++;
    }

    this.logger.log(`✅ COMPLETE CAREERS ENRICHED FOR ${updatedCount} ICONIC PLAYERS!`);
  }
}
