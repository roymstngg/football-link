import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Starting World Football Legends & Icons Seed...');

  // Helper helper to upsert team
  async function upsertTeam(name: string, logo: string, code?: string) {
    const existing = await prisma.team.findFirst({ where: { name } });
    if (existing) {
      return prisma.team.update({ where: { id: existing.id }, data: { logo: logo || existing.logo, code } });
    }
    return prisma.team.create({ data: { name, logo, code, popularRank: 200 } });
  }

  // TEAMS SETUP
  const barca = await upsertTeam('FC Barcelona', 'https://media.api-sports.io/football/teams/529.png', 'BAR');
  const real = await upsertTeam('Real Madrid', 'https://media.api-sports.io/football/teams/541.png', 'RMA');
  const atletico = await upsertTeam('Atlético Madrid', 'https://media.api-sports.io/football/teams/530.png', 'ATM');
  const sevilla = await upsertTeam('Sevilla', 'https://media.api-sports.io/football/teams/536.png', 'SEV');

  const bjk = await upsertTeam('Beşiktaş', 'https://media.api-sports.io/football/teams/549.png', 'BJK');
  const fb = await upsertTeam('Fenerbahçe', 'https://media.api-sports.io/football/teams/611.png', 'FB');
  const gs = await upsertTeam('Galatasaray', 'https://media.api-sports.io/football/teams/645.png', 'GS');
  const ts = await upsertTeam('Trabzonspor', 'https://media.api-sports.io/football/teams/558.png', 'TS');

  const mci = await upsertTeam('Manchester City', 'https://media.api-sports.io/football/teams/50.png', 'MCI');
  const utd = await upsertTeam('Manchester United', 'https://media.api-sports.io/football/teams/33.png', 'MUN');
  const chelsea = await upsertTeam('Chelsea', 'https://media.api-sports.io/football/teams/49.png', 'CHE');
  const arsenal = await upsertTeam('Arsenal', 'https://media.api-sports.io/football/teams/42.png', 'ARS');
  const liverpool = await upsertTeam('Liverpool', 'https://media.api-sports.io/football/teams/40.png', 'LIV');

  const bayern = await upsertTeam('Bayern München', 'https://media.api-sports.io/football/teams/157.png', 'BAY');
  const bvb = await upsertTeam('Borussia Dortmund', 'https://media.api-sports.io/football/teams/165.png', 'BVB');
  const leverkusen = await upsertTeam('Bayer Leverkusen', 'https://media.api-sports.io/football/teams/168.png', 'LEV');

  const acmilan = await upsertTeam('AC Milan', 'https://media.api-sports.io/football/teams/489.png', 'ACM');
  const inter = await upsertTeam('Inter Milan', 'https://media.api-sports.io/football/teams/505.png', 'INT');
  const juventus = await upsertTeam('Juventus', 'https://media.api-sports.io/football/teams/496.png', 'JUV');
  const napoli = await upsertTeam('Napoli', 'https://media.api-sports.io/football/teams/492.png', 'NAP');
  const roma = await upsertTeam('AS Roma', 'https://media.api-sports.io/football/teams/497.png', 'ROM');
  const lazio = await upsertTeam('Lazio', 'https://media.api-sports.io/football/teams/487.png', 'LAZ');
  const fiorentina = await upsertTeam('Fiorentina', 'https://media.api-sports.io/football/teams/502.png', 'FIO');
  const parma = await upsertTeam('Parma', 'https://media.api-sports.io/football/teams/504.png', 'PAR');

  const psg = await upsertTeam('Paris Saint-Germain', 'https://media.api-sports.io/football/teams/85.png', 'PSG');
  const marseille = await upsertTeam('Marseille', 'https://media.api-sports.io/football/teams/81.png', 'OM');
  const lyon = await upsertTeam('Olympique Lyonnais', 'https://media.api-sports.io/football/teams/80.png', 'OL');
  const bordeaux = await upsertTeam('Bordeaux', 'https://media.api-sports.io/football/teams/78.png', 'BOR');

  const benfica = await upsertTeam('Benfica', 'https://media.api-sports.io/football/teams/211.png', 'SLB');
  const porto = await upsertTeam('FC Porto', 'https://media.api-sports.io/football/teams/212.png', 'FCP');
  const sporting = await upsertTeam('Sporting CP', 'https://media.api-sports.io/football/teams/228.png', 'SCP');

  const ajax = await upsertTeam('Ajax', 'https://media.api-sports.io/football/teams/194.png', 'AJX');
  const psv = await upsertTeam('PSV Eindhoven', 'https://media.api-sports.io/football/teams/197.png', 'PSV');
  const feyenoord = await upsertTeam('Feyenoord', 'https://media.api-sports.io/football/teams/198.png', 'FEY');

  const boca = await upsertTeam('Boca Juniors', 'https://media.api-sports.io/football/teams/451.png', 'BOC');
  const river = await upsertTeam('River Plate', 'https://media.api-sports.io/football/teams/435.png', 'RIV');
  const palmeiras = await upsertTeam('Palmeiras', 'https://media.api-sports.io/football/teams/121.png', 'PAL');
  const celtic = await upsertTeam('Celtic', 'https://media.api-sports.io/football/teams/247.png', 'CEL');

  // WORLD LEGENDS LIST
  const legendsData = [
    {
      name: 'Carles Puyol',
      photo: 'https://media.api-sports.io/football/players/144.png',
      nationality: 'Spain',
      aliases: ['puyol', 'carles puyol'],
      teams: [barca]
    },
    {
      name: 'Pepe',
      photo: 'https://media.api-sports.io/football/players/730.png',
      nationality: 'Portugal',
      aliases: ['pepe', 'kepler laveran'],
      teams: [porto, real, bjk]
    },
    {
      name: 'Diego Maradona',
      photo: 'https://media.api-sports.io/football/players/129618.png',
      nationality: 'Argentina',
      aliases: ['maradona', 'diego maradona'],
      teams: [boca, barca, napoli, sevilla]
    },
    {
      name: 'Zinedine Zidane',
      photo: 'https://media.api-sports.io/football/players/145.png',
      nationality: 'France',
      aliases: ['zidane', 'zizou'],
      teams: [juventus, real]
    },
    {
      name: 'Ronaldinho',
      photo: 'https://media.api-sports.io/football/players/147.png',
      nationality: 'Brazil',
      aliases: ['ronaldinho', 'ronaldinho gaucho'],
      teams: [psg, barca, acmilan]
    },
    {
      name: 'Ronaldo Nazário',
      photo: 'https://media.api-sports.io/football/players/146.png',
      nationality: 'Brazil',
      aliases: ['ronaldo r9', 'ronaldo nazario', 'fenomeno'],
      teams: [psv, barca, inter, real, acmilan]
    },
    {
      name: 'Cristiano Ronaldo',
      photo: 'https://media.api-sports.io/football/players/874.png',
      nationality: 'Portugal',
      aliases: ['cr7', 'cristiano ronaldo', 'ronaldo'],
      teams: [sporting, utd, real, juventus]
    },
    {
      name: 'Lionel Messi',
      photo: 'https://media.api-sports.io/football/players/154.png',
      nationality: 'Argentina',
      aliases: ['messi', 'leo messi', 'lionel messi'],
      teams: [barca, psg]
    },
    {
      name: 'Kaká',
      photo: 'https://media.api-sports.io/football/players/148.png',
      nationality: 'Brazil',
      aliases: ['kaka', 'ricardo kaka'],
      teams: [acmilan, real]
    },
    {
      name: 'Thierry Henry',
      photo: 'https://media.api-sports.io/football/players/149.png',
      nationality: 'France',
      aliases: ['henry', 'thierry henry'],
      teams: [juventus, arsenal, barca]
    },
    {
      name: 'Zlatan Ibrahimović',
      photo: 'https://media.api-sports.io/football/players/150.png',
      nationality: 'Sweden',
      aliases: ['zlatan', 'ibrahimovic'],
      teams: [ajax, juventus, inter, barca, acmilan, psg, utd]
    },
    {
      name: 'Steven Gerrard',
      photo: 'https://media.api-sports.io/football/players/293.png',
      nationality: 'England',
      aliases: ['gerrard', 'steven gerrard'],
      teams: [liverpool]
    },
    {
      name: 'Frank Lampard',
      photo: 'https://media.api-sports.io/football/players/294.png',
      nationality: 'England',
      aliases: ['lampard', 'frank lampard'],
      teams: [chelsea, mci]
    },
    {
      name: 'Wayne Rooney',
      photo: 'https://media.api-sports.io/football/players/295.png',
      nationality: 'England',
      aliases: ['rooney', 'wayne rooney'],
      teams: [utd]
    },
    {
      name: 'Xavi Hernández',
      photo: 'https://media.api-sports.io/football/players/151.png',
      nationality: 'Spain',
      aliases: ['xavi', 'xavi hernandez'],
      teams: [barca]
    },
    {
      name: 'Andrés Iniesta',
      photo: 'https://media.api-sports.io/football/players/152.png',
      nationality: 'Spain',
      aliases: ['iniesta', 'andres iniesta'],
      teams: [barca]
    },
    {
      name: 'Andrea Pirlo',
      photo: 'https://media.api-sports.io/football/players/153.png',
      nationality: 'Italy',
      aliases: ['pirlo', 'andrea pirlo'],
      teams: [inter, acmilan, juventus]
    },
    {
      name: 'Gianluigi Buffon',
      photo: 'https://media.api-sports.io/football/players/155.png',
      nationality: 'Italy',
      aliases: ['buffon', 'gianluigi buffon'],
      teams: [juventus, psg]
    },
    {
      name: 'Iker Casillas',
      photo: 'https://media.api-sports.io/football/players/156.png',
      nationality: 'Spain',
      aliases: ['casillas', 'iker casillas'],
      teams: [real, porto]
    },
    {
      name: 'Paolo Maldini',
      photo: 'https://media.api-sports.io/football/players/157.png',
      nationality: 'Italy',
      aliases: ['maldini', 'paolo maldini'],
      teams: [acmilan]
    },
    {
      name: 'Roberto Carlos',
      photo: 'https://media.api-sports.io/football/players/158.png',
      nationality: 'Brazil',
      aliases: ['roberto carlos', 'carlos'],
      teams: [inter, real, fb]
    },
    {
      name: 'David Beckham',
      photo: 'https://media.api-sports.io/football/players/159.png',
      nationality: 'England',
      aliases: ['beckham', 'david beckham'],
      teams: [utd, real, acmilan, psg]
    },
    {
      name: 'Luís Figo',
      photo: 'https://media.api-sports.io/football/players/160.png',
      nationality: 'Portugal',
      aliases: ['figo', 'luis figo'],
      teams: [sporting, barca, real, inter]
    },
    {
      name: 'Didier Drogba',
      photo: 'https://media.api-sports.io/football/players/161.png',
      nationality: 'Ivory Coast',
      aliases: ['drogba', 'didier drogba'],
      teams: [marseille, chelsea, gs]
    },
    {
      name: 'Samuel Eto\'o',
      photo: 'https://media.api-sports.io/football/players/162.png',
      nationality: 'Cameroon',
      aliases: ['etoo', 'samuel etoo'],
      teams: [real, barca, inter, chelsea]
    },
    {
      name: 'Wesley Sneijder',
      photo: 'https://media.api-sports.io/football/players/163.png',
      nationality: 'Netherlands',
      aliases: ['sneijder', 'wesley sneijder'],
      teams: [ajax, real, inter, gs]
    },
    {
      name: 'Gheorghe Hagi',
      photo: 'https://media.api-sports.io/football/players/164.png',
      nationality: 'Romania',
      aliases: ['hagi', 'gheorghe hagi', 'maradona of carpathians'],
      teams: [real, barca, gs]
    },
    {
      name: 'Gheorghe Popescu',
      photo: 'https://media.api-sports.io/football/players/165.png',
      nationality: 'Romania',
      aliases: ['popescu', 'gica popescu'],
      teams: [psv, barca, gs]
    },
    {
      name: 'Clarence Seedorf',
      photo: 'https://media.api-sports.io/football/players/166.png',
      nationality: 'Netherlands',
      aliases: ['seedorf', 'clarence seedorf'],
      teams: [ajax, real, inter, acmilan]
    },
    {
      name: 'Sergio Ramos',
      photo: 'https://media.api-sports.io/football/players/742.png',
      nationality: 'Spain',
      aliases: ['ramos', 'sergio ramos'],
      teams: [sevilla, real, psg]
    },
    {
      name: 'Gerard Piqué',
      photo: 'https://media.api-sports.io/football/players/143.png',
      nationality: 'Spain',
      aliases: ['pique', 'gerard pique'],
      teams: [utd, barca]
    },
    {
      name: 'Franck Ribéry',
      photo: 'https://media.api-sports.io/football/players/508.png',
      nationality: 'France',
      aliases: ['ribery', 'franck ribery'],
      teams: [gs, marseille, bayern]
    },
    {
      name: 'Arjen Robben',
      photo: 'https://media.api-sports.io/football/players/509.png',
      nationality: 'Netherlands',
      aliases: ['robben', 'arjen robben'],
      teams: [psv, chelsea, real, bayern]
    },
    {
      name: 'Mesut Özil',
      photo: 'https://media.api-sports.io/football/players/1469.png',
      nationality: 'Germany',
      aliases: ['ozil', 'mesut ozil'],
      teams: [real, arsenal, fb]
    },
    {
      name: 'Ricardo Quaresma',
      photo: 'https://media.api-sports.io/football/players/902.png',
      nationality: 'Portugal',
      aliases: ['quaresma', 'ricardo quaresma', 'trivela'],
      teams: [sporting, barca, porto, inter, chelsea, bjk]
    },
    {
      name: 'Simão Sabrosa',
      photo: 'https://media.api-sports.io/football/players/903.png',
      nationality: 'Portugal',
      aliases: ['simao', 'simao sabrosa'],
      teams: [sporting, barca, benfica, atletico, bjk]
    },
    {
      name: 'Hugo Almeida',
      photo: 'https://media.api-sports.io/football/players/904.png',
      nationality: 'Portugal',
      aliases: ['hugo almeida', 'almeida'],
      teams: [porto, bjk]
    },
    {
      name: 'Guti Hernández',
      photo: 'https://media.api-sports.io/football/players/906.png',
      nationality: 'Spain',
      aliases: ['guti', 'guti hernandez'],
      teams: [real, bjk]
    },
    {
      name: 'Nicolas Anelka',
      photo: 'https://media.api-sports.io/football/players/907.png',
      nationality: 'France',
      aliases: ['anelka', 'nicolas anelka'],
      teams: [psg, arsenal, real, liverpool, mci, fb, chelsea, juventus]
    },
    {
      name: 'Alex de Souza',
      photo: 'https://media.api-sports.io/football/players/908.png',
      nationality: 'Brazil',
      aliases: ['alex', 'alex de souza', 'kaptan alex'],
      teams: [palmeiras, fb]
    },
    {
      name: 'Pierre van Hooijdonk',
      photo: 'https://media.api-sports.io/football/players/909.png',
      nationality: 'Netherlands',
      aliases: ['van hooijdonk', 'pierre van hooijdonk'],
      teams: [celtic, benfica, feyenoord, fb]
    },
    {
      name: 'Stephen Appiah',
      photo: 'https://media.api-sports.io/football/players/910.png',
      nationality: 'Ghana',
      aliases: ['appiah', 'stephen appiah'],
      teams: [parma, juventus, fb]
    },
    {
      name: 'Deivid de Souza',
      photo: 'https://media.api-sports.io/football/players/911.png',
      nationality: 'Brazil',
      aliases: ['deivid', 'deivid de souza'],
      teams: [bordeaux, sporting, fb]
    },
    {
      name: 'Mateja Kežman',
      photo: 'https://media.api-sports.io/football/players/912.png',
      nationality: 'Serbia',
      aliases: ['kezman', 'mateja kezman'],
      teams: [psv, chelsea, atletico, fb, psg]
    },
    {
      name: 'Diego Lugano',
      photo: 'https://media.api-sports.io/football/players/913.png',
      nationality: 'Uruguay',
      aliases: ['lugano', 'diego lugano', 'tota'],
      teams: [fb, psg]
    },
    {
      name: 'Robin van Persie',
      photo: 'https://media.api-sports.io/football/players/287.png',
      nationality: 'Netherlands',
      aliases: ['van persie', 'robin van persie', 'rvp'],
      teams: [feyenoord, arsenal, utd, fb]
    },
    {
      name: 'Dirk Kuyt',
      photo: 'https://media.api-sports.io/football/players/288.png',
      nationality: 'Netherlands',
      aliases: ['kuyt', 'dirk kuyt'],
      teams: [feyenoord, liverpool, fb]
    },
    {
      name: 'Lukas Podolski',
      photo: 'https://media.api-sports.io/football/players/312.png',
      nationality: 'Germany',
      aliases: ['podolski', 'poldi'],
      teams: [bayern, arsenal, inter, gs]
    },
    {
      name: 'Felipe Melo',
      photo: 'https://media.api-sports.io/football/players/314.png',
      nationality: 'Brazil',
      aliases: ['felipe melo', 'melo', 'pitbull'],
      teams: [fiorentina, juventus, gs, inter]
    },
    {
      name: 'Milan Baroš',
      photo: 'https://media.api-sports.io/football/players/315.png',
      nationality: 'Czech Republic',
      aliases: ['baros', 'milan baros'],
      teams: [liverpool, lyon, gs]
    },
    {
      name: 'Radamel Falcao',
      photo: 'https://media.api-sports.io/football/players/243.png',
      nationality: 'Colombia',
      aliases: ['falcao', 'radamel falcao', 'el tigre'],
      teams: [river, porto, atletico, psg, utd, chelsea, gs]
    }
  ];

  let addedCount = 0;
  for (const item of legendsData) {
    const resolvedTeams = await Promise.all(item.teams);
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

    for (const team of resolvedTeams) {
      if (!team) continue;
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

  console.log(`🌟 SUCCESS: ${addedCount} Iconic World & Turkish Football Legends Seeded!`);
}

main()
  .catch((e) => {
    console.error('❌ Error Seeding Legends:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
