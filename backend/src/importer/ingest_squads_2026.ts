import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Zd61kgmUnvJa@ep-winter-union-ax0ybbso.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
    },
  },
});

interface SquadPlayerInfo {
  name: string;
  normalizedName?: string;
  nationality?: string;
  age?: number;
  photo?: string;
  aliases?: string[];
  teamName: string;
  startYear?: number;
  endYear?: number;
  pastClubs?: string[];
}

const MAJOR_LEAGUES_SQUADS_2026: SquadPlayerInfo[] = [
  // 🇹🇷 TÜRKYİE TRENDYOL SÜPER LİG (GALATASARAY, FENERBAHÇE, BEŞİKTAŞ, TRABZONSPOR)
  { name: 'Victor Osimhen', nationality: 'Nigeria', age: 26, teamName: 'Galatasaray', pastClubs: ['Napoli', 'Lille', 'Charleroi', 'Wolfsburg'] },
  { name: 'Mauro Icardi', nationality: 'Argentina', age: 31, teamName: 'Galatasaray', pastClubs: ['PSG', 'Inter', 'Sampdoria'] },
  { name: 'Barış Alper Yılmaz', nationality: 'Turkey', age: 24, teamName: 'Galatasaray', pastClubs: ['Ankara Keçiörengücü', 'Rize'] },
  { name: 'Fernando Muslera', nationality: 'Uruguay', age: 38, teamName: 'Galatasaray', pastClubs: ['Lazio', 'Nacional'] },
  { name: 'Lucas Torreira', nationality: 'Uruguay', age: 28, teamName: 'Galatasaray', pastClubs: ['Arsenal', 'Atletico Madrid', 'Fiorentina', 'Sampdoria'] },
  { name: 'Gabriel Sara', nationality: 'Brazil', age: 25, teamName: 'Galatasaray', pastClubs: ['Norwich City', 'Sao Paulo'] },
  { name: 'Davinson Sánchez', nationality: 'Colombia', age: 28, teamName: 'Galatasaray', pastClubs: ['Tottenham Hotspur', 'Ajax', 'Atletico Nacional'] },
  { name: 'Roland Sallai', nationality: 'Hungary', age: 27, teamName: 'Galatasaray', pastClubs: ['SC Freiburg', 'APOEL Nicosia', 'Palermo'] },
  { name: 'Dries Mertens', nationality: 'Belgium', age: 37, teamName: 'Galatasaray', pastClubs: ['Napoli', 'PSV Eindhoven', 'Utrecht'] },
  { name: 'Michy Batshuayi', nationality: 'Belgium', age: 30, teamName: 'Galatasaray', pastClubs: ['Fenerbahçe', 'Beşiktaş', 'Chelsea', 'Marseille', 'Valencia', 'Dortmund'] },

  { name: 'Youssef En-Nesyri', nationality: 'Morocco', age: 27, teamName: 'Fenerbahçe', pastClubs: ['Sevilla', 'Leganes', 'Malaga'] },
  { name: 'Edin Džeko', nationality: 'Bosnia and Herzegovina', age: 38, teamName: 'Fenerbahçe', pastClubs: ['Inter', 'AS Roma', 'Manchester City', 'VfL Wolfsburg'] },
  { name: 'Fred', nationality: 'Brazil', age: 31, teamName: 'Fenerbahçe', pastClubs: ['Manchester United', 'Shakhtar Donetsk', 'Internacional'] },
  { name: 'Sebastian Szymański', nationality: 'Poland', age: 25, teamName: 'Fenerbahçe', pastClubs: ['Feyenoord', 'Dynamo Moscow', 'Legia Warsaw'] },
  { name: 'Dušan Tadić', nationality: 'Serbia', age: 35, teamName: 'Fenerbahçe', pastClubs: ['Ajax', 'Southampton', 'Twente', 'Groningen'] },
  { name: 'Sofyan Amrabat', nationality: 'Morocco', age: 28, teamName: 'Fenerbahçe', pastClubs: ['Manchester United', 'Fiorentina', 'Hellas Verona', 'Feyenoord', 'Club Brugge'] },
  { name: 'Allan Saint-Maximin', nationality: 'France', age: 27, teamName: 'Fenerbahçe', pastClubs: ['Al Ahli', 'Newcastle United', 'Nice', 'Monaco', 'Bastia'] },
  { name: 'Dominik Livaković', nationality: 'Croatia', age: 29, teamName: 'Fenerbahçe', pastClubs: ['Dinamo Zagreb', 'NK Zagreb'] },
  { name: 'Çağlar Söyüncü', nationality: 'Turkey', age: 28, teamName: 'Fenerbahçe', pastClubs: ['Atletico Madrid', 'Leicester City', 'SC Freiburg', 'Altınordu'] },
  { name: 'Cengiz Ünder', nationality: 'Turkey', age: 27, teamName: 'Fenerbahçe', pastClubs: ['Marseille', 'Leicester City', 'AS Roma', 'Başakşehir', 'Altınordu'] },

  { name: 'Ciro Immobile', nationality: 'Italy', age: 34, teamName: 'Beşiktaş', pastClubs: ['Lazio', 'Sevilla', 'Borussia Dortmund', 'Torino', 'Genoa', 'Juventus'] },
  { name: 'Rafa Silva', nationality: 'Portugal', age: 31, teamName: 'Beşiktaş', pastClubs: ['Benfica', 'Braga', 'Feirense'] },
  { name: 'Semih Kılıçsoy', nationality: 'Turkey', age: 19, teamName: 'Beşiktaş', pastClubs: [] },
  { name: 'Ernest Muçi', nationality: 'Albania', age: 23, teamName: 'Beşiktaş', pastClubs: ['Legia Warsaw', 'KF Tirana'] },
  { name: 'Milot Rashica', nationality: 'Kosovo', age: 28, teamName: 'Beşiktaş', pastClubs: ['Galatasaray', 'Norwich City', 'Werder Bremen', 'Vitesse'] },
  { name: 'Arthur Masuaku', nationality: 'DR Congo', age: 30, teamName: 'Beşiktaş', pastClubs: ['West Ham United', 'Olympiacos', 'Valenciennes'] },
  { name: 'Gedson Fernandes', nationality: 'Portugal', age: 25, teamName: 'Beşiktaş', pastClubs: ['Rizespor', 'Galatasaray', 'Tottenham Hotspur', 'Benfica'] },
  { name: 'Al-Musrati', nationality: 'Libya', age: 28, teamName: 'Beşiktaş', pastClubs: ['Braga', 'Vitoria Guimaraes', 'Rio Ave'] },

  { name: 'Simon Banza', nationality: 'DR Congo', age: 28, teamName: 'Trabzonspor', pastClubs: ['Braga', 'Lens', 'Famalicao'] },
  { name: 'Edin Višća', nationality: 'Bosnia and Herzegovina', age: 34, teamName: 'Trabzonspor', pastClubs: ['Başakşehir', 'Zeljeznicar'] },
  { name: 'Uğurcan Çakır', nationality: 'Turkey', age: 28, teamName: 'Trabzonspor', pastClubs: ['1461 Trabzon'] },
  { name: 'Anthony Nwakaeme', nationality: 'Nigeria', age: 35, teamName: 'Trabzonspor', pastClubs: ['Al Fayha', 'Hapoel Beer Sheva'] },

  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 İNGİLTERE PREMIER LEAGUE (REAL MADRID, MAN CITY, ARSENAL, LIVERPOOL, CHELSEA)
  { name: 'Erling Haaland', nationality: 'Norway', age: 24, teamName: 'Manchester City', pastClubs: ['Borussia Dortmund', 'RB Salzburg', 'Molde'] },
  { name: 'Kevin De Bruyne', nationality: 'Belgium', age: 33, teamName: 'Manchester City', pastClubs: ['VfL Wolfsburg', 'Chelsea', 'Werder Bremen', 'Genk'] },
  { name: 'Phil Foden', nationality: 'England', age: 24, teamName: 'Manchester City', pastClubs: [] },
  { name: 'Rodri', nationality: 'Spain', age: 28, teamName: 'Manchester City', pastClubs: ['Atletico Madrid', 'Villarreal'] },
  { name: 'Bernardo Silva', nationality: 'Portugal', age: 30, teamName: 'Manchester City', pastClubs: ['Monaco', 'Benfica'] },
  { name: 'Jack Grealish', nationality: 'England', age: 29, teamName: 'Manchester City', pastClubs: ['Aston Villa', 'Notts County'] },
  { name: 'Josko Gvardiol', nationality: 'Croatia', age: 22, teamName: 'Manchester City', pastClubs: ['RB Leipzig', 'Dinamo Zagreb'] },
  { name: 'Savinho', nationality: 'Brazil', age: 20, teamName: 'Manchester City', pastClubs: ['Girona', 'PSV Eindhoven', 'Atletico Mineiro'] },

  { name: 'Bukayo Saka', nationality: 'England', age: 23, teamName: 'Arsenal', pastClubs: [] },
  { name: 'Martin Ødegaard', nationality: 'Norway', age: 25, teamName: 'Arsenal', pastClubs: ['Real Madrid', 'Real Sociedad', 'Vitesse', 'Heerenveen', 'Stromsgodset'] },
  { name: 'Kai Havertz', nationality: 'Germany', age: 25, teamName: 'Arsenal', pastClubs: ['Chelsea', 'Bayer Leverkusen'] },
  { name: 'Declan Rice', nationality: 'England', age: 25, teamName: 'Arsenal', pastClubs: ['West Ham United'] },
  { name: 'Gabriel Jesus', nationality: 'Brazil', age: 27, teamName: 'Arsenal', pastClubs: ['Manchester City', 'Palmeiras'] },
  { name: 'Raheem Sterling', nationality: 'England', age: 29, teamName: 'Arsenal', pastClubs: ['Chelsea', 'Manchester City', 'Liverpool', 'QPR'] },
  { name: 'Mikel Merino', nationality: 'Spain', age: 28, teamName: 'Arsenal', pastClubs: ['Real Sociedad', 'Newcastle United', 'Borussia Dortmund', 'Osasuna'] },
  { name: 'Riccardo Calafiori', nationality: 'Italy', age: 22, teamName: 'Arsenal', pastClubs: ['Bologna', 'FC Basel', 'AS Roma', 'Genoa'] },

  { name: 'Mohamed Salah', nationality: 'Egypt', age: 32, teamName: 'Liverpool', pastClubs: ['AS Roma', 'Fiorentina', 'Chelsea', 'FC Basel'] },
  { name: 'Virgil van Dijk', nationality: 'Netherlands', age: 33, teamName: 'Liverpool', pastClubs: ['Southampton', 'Celtic', 'Groningen'] },
  { name: 'Trent Alexander-Arnold', nationality: 'England', age: 25, teamName: 'Liverpool', pastClubs: [] },
  { name: 'Darwin Núñez', nationality: 'Uruguay', age: 25, teamName: 'Liverpool', pastClubs: ['Benfica', 'Almeria', 'Penarol'] },
  { name: 'Alexis Mac Allister', nationality: 'Argentina', age: 25, teamName: 'Liverpool', pastClubs: ['Brighton', 'Boca Juniors', 'Argentinos Juniors'] },
  { name: 'Dominik Szoboszlai', nationality: 'Hungary', age: 23, teamName: 'Liverpool', pastClubs: ['RB Leipzig', 'RB Salzburg', 'Liefering'] },
  { name: 'Cody Gakpo', nationality: 'Netherlands', age: 25, teamName: 'Liverpool', pastClubs: ['PSV Eindhoven'] },
  { name: 'Federico Chiesa', nationality: 'Italy', age: 26, teamName: 'Liverpool', pastClubs: ['Juventus', 'Fiorentina'] },

  { name: 'Cole Palmer', nationality: 'England', age: 22, teamName: 'Chelsea', pastClubs: ['Manchester City'] },
  { name: 'Enzo Fernández', nationality: 'Argentina', age: 23, teamName: 'Chelsea', pastClubs: ['Benfica', 'River Plate', 'Defensa y Justicia'] },
  { name: 'Moisés Caicedo', nationality: 'Ecuador', age: 22, teamName: 'Chelsea', pastClubs: ['Brighton', 'Beerschot', 'Independiente del Valle'] },
  { name: 'Christopher Nkunku', nationality: 'France', age: 26, teamName: 'Chelsea', pastClubs: ['RB Leipzig', 'PSG'] },
  { name: 'Pedro Neto', nationality: 'Portugal', age: 24, teamName: 'Chelsea', pastClubs: ['Wolverhampton', 'Lazio', 'Braga'] },
  { name: 'Jadon Sancho', nationality: 'England', age: 24, teamName: 'Chelsea', pastClubs: ['Manchester United', 'Borussia Dortmund', 'Manchester City'] },
  { name: 'João Félix', nationality: 'Portugal', age: 24, teamName: 'Chelsea', pastClubs: ['Barcelona', 'Atletico Madrid', 'Benfica'] },

  // 🇪🇸 İSPANYA LA LIGA (REAL MADRID, BARCELONA, ATLETICO MADRID)
  { name: 'Kylian Mbappé', nationality: 'France', age: 25, teamName: 'Real Madrid', pastClubs: ['PSG', 'Monaco'] },
  { name: 'Vinícius Júnior', nationality: 'Brazil', age: 24, teamName: 'Real Madrid', pastClubs: ['Flamengo'] },
  { name: 'Jude Bellingham', nationality: 'England', age: 21, teamName: 'Real Madrid', pastClubs: ['Borussia Dortmund', 'Birmingham City'] },
  { name: 'Rodrygo', nationality: 'Brazil', age: 23, teamName: 'Real Madrid', pastClubs: ['Santos'] },
  { name: 'Arda Güler', nationality: 'Turkey', age: 19, teamName: 'Real Madrid', pastClubs: ['Fenerbahçe'] },
  { name: 'Endrick', nationality: 'Brazil', age: 18, teamName: 'Real Madrid', pastClubs: ['Palmeiras'] },
  { name: 'Luka Modrić', nationality: 'Croatia', age: 38, teamName: 'Real Madrid', pastClubs: ['Tottenham Hotspur', 'Dinamo Zagreb'] },
  { name: 'Thibaut Courtois', nationality: 'Belgium', age: 32, teamName: 'Real Madrid', pastClubs: ['Chelsea', 'Atletico Madrid', 'Genk'] },
  { name: 'Federico Valverde', nationality: 'Uruguay', age: 26, teamName: 'Real Madrid', pastClubs: ['Deportivo La Coruna', 'Penarol'] },
  { name: 'Dani Carvajal', nationality: 'Spain', age: 32, teamName: 'Real Madrid', pastClubs: ['Bayer Leverkusen'] },
  { name: 'Antonio Rüdiger', nationality: 'Germany', age: 31, teamName: 'Real Madrid', pastClubs: ['Chelsea', 'AS Roma', 'VfB Stuttgart'] },

  { name: 'Lamine Yamal', nationality: 'Spain', age: 17, teamName: 'FC Barcelona', pastClubs: [] },
  { name: 'Robert Lewandowski', nationality: 'Poland', age: 36, teamName: 'FC Barcelona', pastClubs: ['Bayern Munich', 'Borussia Dortmund', 'Lech Poznan'] },
  { name: 'Raphinha', nationality: 'Brazil', age: 27, teamName: 'FC Barcelona', pastClubs: ['Leeds United', 'Rennes', 'Sporting CP', 'Vitoria Guimaraes'] },
  { name: 'Pedri', nationality: 'Spain', age: 21, teamName: 'FC Barcelona', pastClubs: ['Las Palmas'] },
  { name: 'Gavi', nationality: 'Spain', age: 20, teamName: 'FC Barcelona', pastClubs: [] },
  { name: 'Dani Olmo', nationality: 'Spain', age: 26, teamName: 'FC Barcelona', pastClubs: ['RB Leipzig', 'Dinamo Zagreb'] },
  { name: 'Frenkie de Jong', nationality: 'Netherlands', age: 27, teamName: 'FC Barcelona', pastClubs: ['Ajax', 'Willem II'] },
  { name: 'Jules Koundé', nationality: 'France', age: 25, teamName: 'FC Barcelona', pastClubs: ['Sevilla', 'Bordeaux'] },
  { name: 'Wojciech Szczęsny', nationality: 'Poland', age: 34, teamName: 'FC Barcelona', pastClubs: ['Juventus', 'AS Roma', 'Arsenal', 'Brentford'] },

  { name: 'Julián Álvarez', nationality: 'Argentina', age: 24, teamName: 'Atletico Madrid', pastClubs: ['Manchester City', 'River Plate'] },
  { name: 'Antoine Griezmann', nationality: 'France', age: 33, teamName: 'Atletico Madrid', pastClubs: ['FC Barcelona', 'Real Sociedad'] },
  { name: 'Alexander Sørloth', nationality: 'Norway', age: 28, teamName: 'Atletico Madrid', pastClubs: ['Villarreal', 'Real Sociedad', 'RB Leipzig', 'Trabzonspor', 'Gent', 'Crystal Palace'] },
  { name: 'Conor Gallagher', nationality: 'England', age: 24, teamName: 'Atletico Madrid', pastClubs: ['Chelsea', 'Crystal Palace', 'West Bromwich', 'Swansea City'] },
  { name: 'Rodrigo De Paul', nationality: 'Argentina', age: 30, teamName: 'Atletico Madrid', pastClubs: ['Udinese', 'Valencia', 'Racing Club'] },

  // 🇩🇪 ALMANYA BUNDESLIGA (BAYERN MUNICH, DORTMUND, LEVERKUSEN)
  { name: 'Harry Kane', nationality: 'England', age: 31, teamName: 'Bayern Munich', pastClubs: ['Tottenham Hotspur', 'Leicester City', 'Norwich City', 'Millwall'] },
  { name: 'Jamal Musiala', nationality: 'Germany', age: 21, teamName: 'Bayern Munich', pastClubs: ['Chelsea'] },
  { name: 'Michael Olise', nationality: 'France', age: 22, teamName: 'Bayern Munich', pastClubs: ['Crystal Palace', 'Reading'] },
  { name: 'Leroy Sané', nationality: 'Germany', age: 28, teamName: 'Bayern Munich', pastClubs: ['Manchester City', 'Schalke 04'] },
  { name: 'Serge Gnabry', nationality: 'Germany', age: 29, teamName: 'Bayern Munich', pastClubs: ['Werder Bremen', 'Hoffenheim', 'Arsenal', 'West Bromwich'] },
  { name: 'Joshua Kimmich', nationality: 'Germany', age: 29, teamName: 'Bayern Munich', pastClubs: ['RB Leipzig', 'VfB Stuttgart'] },
  { name: 'Manuel Neuer', nationality: 'Germany', age: 38, teamName: 'Bayern Munich', pastClubs: ['Schalke 04'] },

  { name: 'Florian Wirtz', nationality: 'Germany', age: 21, teamName: 'Bayer Leverkusen', pastClubs: ['1. FC Köln'] },
  { name: 'Victor Boniface', nationality: 'Nigeria', age: 23, teamName: 'Bayer Leverkusen', pastClubs: ['Union SG', 'Bodo/Glimt'] },
  { name: 'Granit Xhaka', nationality: 'Switzerland', age: 31, teamName: 'Bayer Leverkusen', pastClubs: ['Arsenal', 'Borussia Monchengladbach', 'FC Basel'] },
  { name: 'Alejandro Grimaldo', nationality: 'Spain', age: 28, teamName: 'Bayer Leverkusen', pastClubs: ['Benfica', 'FC Barcelona'] },
  { name: 'Jeremie Frimpong', nationality: 'Netherlands', age: 23, teamName: 'Bayer Leverkusen', pastClubs: ['Celtic', 'Manchester City'] },

  { name: 'Serhou Guirassy', nationality: 'Guinea', age: 28, teamName: 'Borussia Dortmund', pastClubs: ['VfB Stuttgart', 'Rennes', 'Amiens', 'Köln', 'Lille'] },
  { name: 'Julian Brandt', nationality: 'Germany', age: 28, teamName: 'Borussia Dortmund', pastClubs: ['Bayer Leverkusen', 'VfL Wolfsburg'] },
  { name: 'Karim Adeyemi', nationality: 'Germany', age: 22, teamName: 'Borussia Dortmund', pastClubs: ['RB Salzburg', 'Liefering'] },
  { name: 'Nico Schlotterbeck', nationality: 'Germany', age: 24, teamName: 'Borussia Dortmund', pastClubs: ['SC Freiburg', 'Union Berlin'] },
];

function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

async function ingestSquads() {
  console.log('🚀 2026/2027 Sezonu Büyük Lig Kadroları Veritabanına Yükleniyor...');
  let addedCount = 0;
  let updatedCount = 0;

  for (const info of MAJOR_LEAGUES_SQUADS_2026) {
    const norm = normalizeName(info.name);

    // Find team in DB
    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { name: { equals: info.teamName, mode: 'insensitive' } },
          { name: { contains: info.teamName, mode: 'insensitive' } },
        ],
      },
    });

    if (!team) {
      console.log(`⚠️ Takım bulunamadı: ${info.teamName} (Atlanıyor)`);
      continue;
    }

    // Find or Create Player
    let player = await prisma.player.findFirst({
      where: {
        OR: [
          { normalizedName: norm },
          { name: { equals: info.name, mode: 'insensitive' } },
        ],
      },
    });

    if (!player) {
      player = await prisma.player.create({
        data: {
          name: info.name,
          normalizedName: norm,
          nationality: info.nationality,
          age: info.age,
          photo: info.photo || `https://media.api-sports.io/football/players/default.png`,
          aliases: [norm, info.name.toLowerCase()],
        },
      });
      addedCount++;
    } else {
      updatedCount++;
    }

    // Link Current Team Career
    await prisma.playerCareer.upsert({
      where: {
        playerId_teamId: {
          playerId: player.id,
          teamId: team.id,
        },
      },
      create: {
        playerId: player.id,
        teamId: team.id,
        startYear: 2024,
        endYear: 2026,
        isLoan: false,
      },
      update: {
        startYear: 2024,
        endYear: 2026,
      },
    }).catch(() => {});

    // Link Past Career Teams if found
    if (info.pastClubs && info.pastClubs.length > 0) {
      for (const clubName of info.pastClubs) {
        const pastTeam = await prisma.team.findFirst({
          where: {
            OR: [
              { name: { equals: clubName, mode: 'insensitive' } },
              { name: { contains: clubName, mode: 'insensitive' } },
            ],
          },
        });

        if (pastTeam && pastTeam.id !== team.id) {
          await prisma.playerCareer.upsert({
            where: {
              playerId_teamId: {
                playerId: player.id,
                teamId: pastTeam.id,
              },
            },
            create: {
              playerId: player.id,
              teamId: pastTeam.id,
              startYear: 2020,
              endYear: 2024,
              isLoan: false,
            },
            update: {},
          }).catch(() => {});
        }
      }
    }
  }

  console.log(`✅ 2026/2027 SEZONU KADRO YÜKLEME TAMAMLANDI!`);
  console.log(`Yeni Eklenen Oyuncular: ${addedCount}`);
  console.log(`Güncellenen Oyuncular: ${updatedCount}`);
  console.log(`Toplam Oyuncu Sayısı: ${await prisma.player.count()}`);
  console.log(`Toplam Kariyer Bağlantısı: ${await prisma.playerCareer.count()}`);
}

ingestSquads()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
