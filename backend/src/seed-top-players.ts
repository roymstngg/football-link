import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Top Leagues Player & Career History Seed...');

  // 1. COUNTRIES
  const tr = await prisma.country.upsert({ where: { name: 'Türkiye' }, update: {}, create: { name: 'Türkiye', code: 'TR' } });
  const en = await prisma.country.upsert({ where: { name: 'England' }, update: {}, create: { name: 'England', code: 'GB' } });
  const es = await prisma.country.upsert({ where: { name: 'Spain' }, update: {}, create: { name: 'Spain', code: 'ES' } });
  const de = await prisma.country.upsert({ where: { name: 'Germany' }, update: {}, create: { name: 'Germany', code: 'DE' } });
  const pt = await prisma.country.upsert({ where: { name: 'Portugal' }, update: {}, create: { name: 'Portugal', code: 'PT' } });
  const it = await prisma.country.upsert({ where: { name: 'Italy' }, update: {}, create: { name: 'Italy', code: 'IT' } });
  const fr = await prisma.country.upsert({ where: { name: 'France' }, update: {}, create: { name: 'France', code: 'FR' } });

  // 2. LEAGUES
  const superLig = await prisma.league.upsert({ where: { apiId: 203 }, update: {}, create: { apiId: 203, name: 'Trendyol Süper Lig', countryId: tr.id, logo: 'https://media.api-sports.io/football/leagues/203.png' } });
  const epl = await prisma.league.upsert({ where: { apiId: 39 }, update: {}, create: { apiId: 39, name: 'Premier League', countryId: en.id, logo: 'https://media.api-sports.io/football/leagues/39.png' } });
  const laLiga = await prisma.league.upsert({ where: { apiId: 140 }, update: {}, create: { apiId: 140, name: 'La Liga', countryId: es.id, logo: 'https://media.api-sports.io/football/leagues/140.png' } });
  const bundesliga = await prisma.league.upsert({ where: { apiId: 78 }, update: {}, create: { apiId: 78, name: 'Bundesliga', countryId: de.id, logo: 'https://media.api-sports.io/football/leagues/78.png' } });
  const ligaPortugal = await prisma.league.upsert({ where: { apiId: 94 }, update: {}, create: { apiId: 94, name: 'Liga Portugal', countryId: pt.id, logo: 'https://media.api-sports.io/football/leagues/94.png' } });

  // Helper helper to upsert team
  async function upsertTeam(name: string, logo: string, code?: string, leagueId?: string, countryId?: string) {
    const existing = await prisma.team.findFirst({ where: { name } });
    if (existing) {
      return prisma.team.update({ where: { id: existing.id }, data: { logo, code, leagueId, countryId } });
    }
    return prisma.team.create({ data: { name, logo, code, leagueId, countryId, popularRank: 100 } });
  }

  // 3. TEAMS
  // Süper Lig
  const bjk = await upsertTeam('Beşiktaş', 'https://media.api-sports.io/football/teams/549.png', 'BJK', superLig.id, tr.id);
  const fb = await upsertTeam('Fenerbahçe', 'https://media.api-sports.io/football/teams/611.png', 'FB', superLig.id, tr.id);
  const gs = await upsertTeam('Galatasaray', 'https://media.api-sports.io/football/teams/645.png', 'GS', superLig.id, tr.id);
  const ts = await upsertTeam('Trabzonspor', 'https://media.api-sports.io/football/teams/558.png', 'TS', superLig.id, tr.id);

  // Premier League
  const mci = await upsertTeam('Manchester City', 'https://media.api-sports.io/football/teams/50.png', 'MCI', epl.id, en.id);
  const utd = await upsertTeam('Manchester United', 'https://media.api-sports.io/football/teams/33.png', 'MUN', epl.id, en.id);
  const che = await upsertTeam('Chelsea', 'https://media.api-sports.io/football/teams/49.png', 'CHE', epl.id, en.id);
  const ars = await upsertTeam('Arsenal', 'https://media.api-sports.io/football/teams/42.png', 'ARS', epl.id, en.id);
  const liv = await upsertTeam('Liverpool', 'https://media.api-sports.io/football/teams/40.png', 'LIV', epl.id, en.id);

  // La Liga
  const rma = await upsertTeam('Real Madrid', 'https://media.api-sports.io/football/teams/541.png', 'RMA', laLiga.id, es.id);
  const bar = await upsertTeam('FC Barcelona', 'https://media.api-sports.io/football/teams/529.png', 'BAR', laLiga.id, es.id);
  const atm = await upsertTeam('Atlético Madrid', 'https://media.api-sports.io/football/teams/530.png', 'ATM', laLiga.id, es.id);
  const sev = await upsertTeam('Sevilla', 'https://media.api-sports.io/football/teams/536.png', 'SEV', laLiga.id, es.id);

  // Bundesliga
  const bay = await upsertTeam('Bayern München', 'https://media.api-sports.io/football/teams/157.png', 'BAY', bundesliga.id, de.id);
  const bvb = await upsertTeam('Borussia Dortmund', 'https://media.api-sports.io/football/teams/165.png', 'BVB', bundesliga.id, de.id);
  const lev = await upsertTeam('Bayer Leverkusen', 'https://media.api-sports.io/football/teams/168.png', 'LEV', bundesliga.id, de.id);
  const rbl = await upsertTeam('RB Leipzig', 'https://media.api-sports.io/football/teams/173.png', 'RBL', bundesliga.id, de.id);

  // Liga Portugal
  const ben = await upsertTeam('Benfica', 'https://media.api-sports.io/football/teams/211.png', 'SLB', ligaPortugal.id, pt.id);
  const por = await upsertTeam('FC Porto', 'https://media.api-sports.io/football/teams/212.png', 'FCP', ligaPortugal.id, pt.id);
  const scp = await upsertTeam('Sporting CP', 'https://media.api-sports.io/football/teams/228.png', 'SCP', ligaPortugal.id, pt.id);

  // Other Top European Teams (For Career Paths)
  const psg = await upsertTeam('Paris Saint-Germain', 'https://media.api-sports.io/football/teams/85.png', 'PSG', undefined, fr.id);
  const nap = await upsertTeam('Napoli', 'https://media.api-sports.io/football/teams/492.png', 'NAP', undefined, it.id);
  const laz = await upsertTeam('Lazio', 'https://media.api-sports.io/football/teams/487.png', 'LAZ', undefined, it.id);
  const int = await upsertTeam('Inter Milan', 'https://media.api-sports.io/football/teams/505.png', 'INT', undefined, it.id);
  const juv = await upsertTeam('Juventus', 'https://media.api-sports.io/football/teams/496.png', 'JUV', undefined, it.id);
  const lil = await upsertTeam('Lille', 'https://media.api-sports.io/football/teams/79.png', 'LIL', undefined, fr.id);
  const ajx = await upsertTeam('Ajax', 'https://media.api-sports.io/football/teams/194.png', 'AJX');
  const sha = await upsertTeam('Shakhtar Donetsk', 'https://media.api-sports.io/football/teams/550.png', 'SHA');

  // 4. STAR PLAYERS AND CAREER TIMELINES
  const playersData = [
    // --- SÜPER LİG YILDIZLARI ---
    {
      name: 'Victor Osimhen',
      photo: 'https://media.api-sports.io/football/players/2822.png',
      nationality: 'Nigeria',
      aliases: ['osimhen', 'victor osimhen'],
      teams: [lil, nap, gs]
    },
    {
      name: 'Mauro Icardi',
      photo: 'https://media.api-sports.io/football/players/1887.png',
      nationality: 'Argentina',
      aliases: ['icardi', 'mauro icardi'],
      teams: [int, psg, gs]
    },
    {
      name: 'Edin Džeko',
      photo: 'https://media.api-sports.io/football/players/754.png',
      nationality: 'Bosnia',
      aliases: ['dzeko', 'edin dzeko'],
      teams: [mci, int, fb]
    },
    {
      name: 'Dušan Tadić',
      photo: 'https://media.api-sports.io/football/players/642.png',
      nationality: 'Serbia',
      aliases: ['tadic', 'dusan tadic'],
      teams: [ajx, fb]
    },
    {
      name: 'Rafa Silva',
      photo: 'https://media.api-sports.io/football/players/1247.png',
      nationality: 'Portugal',
      aliases: ['rafa silva', 'rafa'],
      teams: [ben, bjk]
    },
    {
      name: 'Ciro Immobile',
      photo: 'https://media.api-sports.io/football/players/303.png',
      nationality: 'Italy',
      aliases: ['immobile', 'ciro immobile'],
      teams: [bvb, sev, laz, bjk]
    },
    {
      name: 'Fred',
      photo: 'https://media.api-sports.io/football/players/905.png',
      nationality: 'Brazil',
      aliases: ['fred', 'frederico'],
      teams: [sha, utd, fb]
    },
    {
      name: 'Kerem Aktürkoğlu',
      photo: 'https://media.api-sports.io/football/players/158024.png',
      nationality: 'Turkey',
      aliases: ['kerem', 'kerem akturkoglu'],
      teams: [gs, ben]
    },
    {
      name: 'Allan Saint-Maximin',
      photo: 'https://media.api-sports.io/football/players/18779.png',
      nationality: 'France',
      aliases: ['saint maximin', 'maximin'],
      teams: [lil, fb]
    },
    {
      name: 'Gedson Fernandes',
      photo: 'https://media.api-sports.io/football/players/901.png',
      nationality: 'Portugal',
      aliases: ['gedson', 'gedson fernandes'],
      teams: [ben, che, gs, bjk]
    },
    {
      name: 'Michy Batshuayi',
      photo: 'https://media.api-sports.io/football/players/2288.png',
      nationality: 'Belgium',
      aliases: ['batshuayi', 'michy batshuayi'],
      teams: [che, bjk, fb, gs]
    },
    {
      name: 'Fernando Muslera',
      photo: 'https://media.api-sports.io/football/players/158.png',
      nationality: 'Uruguay',
      aliases: ['muslera', 'nando muslera'],
      teams: [laz, gs]
    },
    {
      name: 'Barış Alper Yılmaz',
      photo: 'https://media.api-sports.io/football/players/190823.png',
      nationality: 'Turkey',
      aliases: ['baris alper', 'bay'],
      teams: [gs]
    },
    {
      name: 'Arda Güler',
      photo: 'https://media.api-sports.io/football/players/306233.png',
      nationality: 'Turkey',
      aliases: ['arda guler', 'arda'],
      teams: [fb, rma]
    },

    // --- PREMIER LEAGUE YILDIZLARI ---
    {
      name: 'Erling Haaland',
      photo: 'https://media.api-sports.io/football/players/1100.png',
      nationality: 'Norway',
      aliases: ['haaland', 'erling haaland'],
      teams: [bvb, mci]
    },
    {
      name: 'Kevin De Bruyne',
      photo: 'https://media.api-sports.io/football/players/629.png',
      nationality: 'Belgium',
      aliases: ['de bruyne', 'kdb'],
      teams: [che, lev, mci]
    },
    {
      name: 'Mohamed Salah',
      photo: 'https://media.api-sports.io/football/players/304.png',
      nationality: 'Egypt',
      aliases: ['salah', 'mo salah'],
      teams: [che, laz, liv]
    },
    {
      name: 'Bukayo Saka',
      photo: 'https://media.api-sports.io/football/players/1468.png',
      nationality: 'England',
      aliases: ['saka', 'bukayo saka'],
      teams: [ars]
    },
    {
      name: 'Bruno Fernandes',
      photo: 'https://media.api-sports.io/football/players/1484.png',
      nationality: 'Portugal',
      aliases: ['bruno fernandes', 'bruno'],
      teams: [scp, utd]
    },
    {
      name: 'Raheem Sterling',
      photo: 'https://media.api-sports.io/football/players/645.png',
      nationality: 'England',
      aliases: ['sterling', 'raheem sterling'],
      teams: [liv, mci, che, ars]
    },
    {
      name: 'İlkay Gündoğan',
      photo: 'https://media.api-sports.io/football/players/313.png',
      nationality: 'Germany',
      aliases: ['ilkay', 'ilkay gundogan'],
      teams: [bvb, mci, bar]
    },
    {
      name: 'Kai Havertz',
      photo: 'https://media.api-sports.io/football/players/987.png',
      nationality: 'Germany',
      aliases: ['havertz', 'kai havertz'],
      teams: [lev, che, ars]
    },
    {
      name: 'Gabriel Jesus',
      photo: 'https://media.api-sports.io/football/players/643.png',
      nationality: 'Brazil',
      aliases: ['jesus', 'gabriel jesus'],
      teams: [mci, ars]
    },
    {
      name: 'Jadon Sancho',
      photo: 'https://media.api-sports.io/football/players/10.png',
      nationality: 'England',
      aliases: ['sancho', 'jadon sancho'],
      teams: [mci, bvb, utd, che]
    },

    // --- LA LIGA YILDIZLARI ---
    {
      name: 'Kylian Mbappé',
      photo: 'https://media.api-sports.io/football/players/278.png',
      nationality: 'France',
      aliases: ['mbappe', 'kylian mbappe'],
      teams: [psg, rma]
    },
    {
      name: 'Jude Bellingham',
      photo: 'https://media.api-sports.io/football/players/152982.png',
      nationality: 'England',
      aliases: ['bellingham', 'jude bellingham'],
      teams: [bvb, rma]
    },
    {
      name: 'Vinícius Júnior',
      photo: 'https://media.api-sports.io/football/players/752.png',
      nationality: 'Brazil',
      aliases: ['vinicius', 'vini jr'],
      teams: [rma]
    },
    {
      name: 'Robert Lewandowski',
      photo: 'https://media.api-sports.io/football/players/521.png',
      nationality: 'Poland',
      aliases: ['lewandowski', 'lewy'],
      teams: [bvb, bay, bar]
    },
    {
      name: 'Lamine Yamal',
      photo: 'https://media.api-sports.io/football/players/384074.png',
      nationality: 'Spain',
      aliases: ['yamal', 'lamine yamal'],
      teams: [bar]
    },
    {
      name: 'Antoine Griezmann',
      photo: 'https://media.api-sports.io/football/players/244.png',
      nationality: 'France',
      aliases: ['griezmann', 'antoine griezmann'],
      teams: [atm, bar]
    },
    {
      name: 'Julián Alvarez',
      photo: 'https://media.api-sports.io/football/players/6102.png',
      nationality: 'Argentina',
      aliases: ['julian alvarez', 'alvarez'],
      teams: [mci, atm]
    },
    {
      name: 'Thibaut Courtois',
      photo: 'https://media.api-sports.io/football/players/738.png',
      nationality: 'Belgium',
      aliases: ['courtois', 'thibaut courtois'],
      teams: [atm, che, rma]
    },

    // --- BUNDESLIGA YILDIZLARI ---
    {
      name: 'Harry Kane',
      photo: 'https://media.api-sports.io/football/players/184.png',
      nationality: 'England',
      aliases: ['kane', 'harry kane'],
      teams: [bay]
    },
    {
      name: 'Jamal Musiala',
      photo: 'https://media.api-sports.io/football/players/161907.png',
      nationality: 'Germany',
      aliases: ['musiala', 'jamal musiala'],
      teams: [che, bay]
    },
    {
      name: 'Leroy Sané',
      photo: 'https://media.api-sports.io/football/players/502.png',
      nationality: 'Germany',
      aliases: ['sane', 'leroy sane'],
      teams: [mci, bay]
    },
    {
      name: 'Granit Xhaka',
      photo: 'https://media.api-sports.io/football/players/1470.png',
      nationality: 'Switzerland',
      aliases: ['xhaka', 'granit xhaka'],
      teams: [ars, lev]
    },
    {
      name: 'Serhou Guirassy',
      photo: 'https://media.api-sports.io/football/players/19078.png',
      nationality: 'Guinea',
      aliases: ['guirassy', 'serhou guirassy'],
      teams: [bvb]
    },
    {
      name: 'Marcel Sabitzer',
      photo: 'https://media.api-sports.io/football/players/1039.png',
      nationality: 'Austria',
      aliases: ['sabitzer', 'marcel sabitzer'],
      teams: [rbl, bay, utd, bvb]
    },

    // --- LİGA PORTUGAL YILDIZLARI ---
    {
      name: 'Viktor Gyökeres',
      photo: 'https://media.api-sports.io/football/players/19448.png',
      nationality: 'Sweden',
      aliases: ['gyokeres', 'viktor gyokeres'],
      teams: [scp]
    },
    {
      name: 'Ángel Di María',
      photo: 'https://media.api-sports.io/football/players/184.png',
      nationality: 'Argentina',
      aliases: ['di maria', 'angel di maria'],
      teams: [ben, rma, utd, psg, juv]
    },
    {
      name: 'Nicolás Otamendi',
      photo: 'https://media.api-sports.io/football/players/627.png',
      nationality: 'Argentina',
      aliases: ['otamendi', 'nicolas otamendi'],
      teams: [por, sev, mci, ben]
    },
    {
      name: 'Orkun Kökçü',
      photo: 'https://media.api-sports.io/football/players/38058.png',
      nationality: 'Turkey',
      aliases: ['orkun', 'orkun kokcu'],
      teams: [ben]
    }
  ];

  let addedCount = 0;
  for (const item of playersData) {
    const normalizedName = item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let player = await prisma.player.findFirst({ where: { name: item.name } });
    if (player) {
      player = await prisma.player.update({
        where: { id: player.id },
        data: { photo: item.photo, nationality: item.nationality, aliases: item.aliases },
      });
    } else {
      player = await prisma.player.create({
        data: {
          name: item.name,
          normalizedName,
          photo: item.photo,
          nationality: item.nationality,
          aliases: item.aliases,
        },
      });
    }

    for (const team of item.teams) {
      await prisma.playerCareer.upsert({
        where: {
          playerId_teamId: { playerId: player.id, teamId: team.id }
        },
        update: {},
        create: {
          playerId: player.id,
          teamId: team.id,
        }
      });
    }
    addedCount++;
  }

  console.log(`✅ SUCCESS: ${addedCount} Top League Star Players & Transfer Careers successfully seeded!`);
}

main()
  .catch((e) => {
    console.error('❌ Error Seeding Data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
