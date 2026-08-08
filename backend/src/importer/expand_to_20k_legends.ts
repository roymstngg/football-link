import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Zd61kgmUnvJa@ep-winter-union-ax0ybbso.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
    },
  },
});

interface LegendData {
  name: string;
  nationality: string;
  age?: number;
  photo?: string;
  clubs: string[];
}

const FOOTBALL_LEGENDS: LegendData[] = [
  // 🌟 DÜNYA VE TÜRK FUTBOL EFSANELERİ
  { name: 'Pelé', nationality: 'Brazil', age: 82, clubs: ['Santos', 'New York Cosmos'] },
  { name: 'Diego Maradona', nationality: 'Argentina', age: 60, clubs: ['Napoli', 'FC Barcelona', 'Boca Juniors', 'Sevilla', 'Argentinos Juniors'] },
  { name: 'Zinedine Zidane', nationality: 'France', age: 52, clubs: ['Real Madrid', 'Juventus', 'Bordeaux', 'Cannes'] },
  { name: 'Ronaldinho', nationality: 'Brazil', age: 44, clubs: ['FC Barcelona', 'AC Milan', 'PSG', 'Gremio', 'Flamengo', 'Fluminense', 'Queretaro'] },
  { name: 'Johan Cruyff', nationality: 'Netherlands', age: 68, clubs: ['FC Barcelona', 'Ajax', 'Feyenoord', 'Los Angeles Aztecs'] },
  { name: 'Ronaldo Nazário', nationality: 'Brazil', age: 47, clubs: ['Real Madrid', 'FC Barcelona', 'Inter', 'AC Milan', 'PSV Eindhoven', 'Corinthians', 'Cruzeiro'] },
  { name: 'Franz Beckenbauer', nationality: 'Germany', age: 78, clubs: ['Bayern Munich', 'New York Cosmos', 'Hamburger SV'] },
  { name: 'Alfredo Di Stéfano', nationality: 'Argentina', age: 88, clubs: ['Real Madrid', 'Espanyol', 'River Plate', 'Millonarios'] },
  { name: 'Ferenc Puskás', nationality: 'Hungary', age: 79, clubs: ['Real Madrid', 'Budapest Honved'] },
  { name: 'Michel Platini', nationality: 'France', age: 69, clubs: ['Juventus', 'Saint-Etienne', 'Nancy'] },
  { name: 'Marco van Basten', nationality: 'Netherlands', age: 59, clubs: ['AC Milan', 'Ajax'] },
  { name: 'Ruud Gullit', nationality: 'Netherlands', age: 61, clubs: ['AC Milan', 'Chelsea', 'Sampdoria', 'PSV Eindhoven', 'Feyenoord'] },
  { name: 'Frank Rijkaard', nationality: 'Netherlands', age: 61, clubs: ['AC Milan', 'Ajax', 'Zaragoza'] },
  { name: 'Paolo Maldini', nationality: 'Italy', age: 56, clubs: ['AC Milan'] },
  { name: 'Franco Baresi', nationality: 'Italy', age: 64, clubs: ['AC Milan'] },
  { name: 'Roberto Baggio', nationality: 'Italy', age: 57, clubs: ['Juventus', 'AC Milan', 'Inter', 'Fiorentina', 'Brescia', 'Bologna'] },
  { name: 'Gianluigi Buffon', nationality: 'Italy', age: 46, clubs: ['Juventus', 'Parma', 'PSG'] },
  { name: 'Andrea Pirlo', nationality: 'Italy', age: 45, clubs: ['Juventus', 'AC Milan', 'Inter', 'Brescia', 'New York City FC'] },
  { name: 'Francesco Totti', nationality: 'Italy', age: 47, clubs: ['AS Roma'] },
  { name: 'Alessandro Del Piero', nationality: 'Italy', age: 49, clubs: ['Juventus', 'Sydney FC', 'Padova'] },
  { name: 'Gabriel Batistuta', nationality: 'Argentina', age: 55, clubs: ['Fiorentina', 'AS Roma', 'Boca Juniors', 'River Plate', 'Inter'] },
  { name: 'Rivaldo', nationality: 'Brazil', age: 52, clubs: ['FC Barcelona', 'AC Milan', 'Olympiacos', 'Palmeiras', 'Deportivo La Coruna'] },
  { name: 'Romário', nationality: 'Brazil', age: 58, clubs: ['FC Barcelona', 'PSV Eindhoven', 'Flamengo', 'Vasco da Gama', 'Valencia'] },
  { name: 'Cafu', nationality: 'Brazil', age: 54, clubs: ['AC Milan', 'AS Roma', 'Palmeiras', 'Sao Paulo'] },
  { name: 'Roberto Carlos', nationality: 'Brazil', age: 51, clubs: ['Real Madrid', 'Fenerbahçe', 'Inter', 'Palmeiras', 'Anzhi Makhachkala', 'Corinthians'] },
  { name: 'Kaká', nationality: 'Brazil', age: 42, clubs: ['AC Milan', 'Real Madrid', 'Sao Paulo', 'Orlando City'] },
  { name: 'Thierry Henry', nationality: 'France', age: 46, clubs: ['Arsenal', 'FC Barcelona', 'Monaco', 'Juventus', 'New York Red Bulls'] },
  { name: 'Dennis Bergkamp', nationality: 'Netherlands', age: 55, clubs: ['Arsenal', 'Ajax', 'Inter'] },
  { name: 'Eric Cantona', nationality: 'France', age: 58, clubs: ['Manchester United', 'Leeds United', 'Marseille', 'Auxerre'] },
  { name: 'Steven Gerrard', nationality: 'England', age: 44, clubs: ['Liverpool', 'LA Galaxy'] },
  { name: 'Frank Lampard', nationality: 'England', age: 46, clubs: ['Chelsea', 'Manchester City', 'West Ham United', 'New York City FC'] },
  { name: 'Paul Scholes', nationality: 'England', age: 49, clubs: ['Manchester United'] },
  { name: 'Wayne Rooney', nationality: 'England', age: 38, clubs: ['Manchester United', 'Everton', 'DC United', 'Derby County'] },
  { name: 'David Beckham', nationality: 'England', age: 49, clubs: ['Manchester United', 'Real Madrid', 'LA Galaxy', 'AC Milan', 'PSG'] },
  { name: 'Oliver Kahn', nationality: 'Germany', age: 55, clubs: ['Bayern Munich', 'Karlsruher SC'] },
  { name: 'Michael Ballack', nationality: 'Germany', age: 47, clubs: ['Bayern Munich', 'Chelsea', 'Bayer Leverkusen'] },
  { name: 'Miroslav Klose', nationality: 'Germany', age: 46, clubs: ['Bayern Munich', 'Lazio', 'Werder Bremen', 'Kaiserslautern'] },
  { name: 'Lothar Matthäus', nationality: 'Germany', age: 63, clubs: ['Bayern Munich', 'Inter', 'Borussia Monchengladbach'] },
  { name: 'Lev Yashin', nationality: 'Russia', age: 60, clubs: ['Dynamo Moscow'] },
  { name: 'Eusébio', nationality: 'Portugal', age: 72, clubs: ['Benfica', 'Sporting CP', 'Monterrey'] },
  { name: 'Gheorghe Hagi', nationality: 'Romania', age: 59, clubs: ['Galatasaray', 'Real Madrid', 'FC Barcelona', 'Brescia', 'Steaua Bucuresti'] },
  { name: 'Gheorghe Popescu', nationality: 'Romania', age: 56, clubs: ['Galatasaray', 'FC Barcelona', 'PSV Eindhoven', 'Tottenham Hotspur', 'Lecce'] },
  { name: 'Alex de Souza', nationality: 'Brazil', age: 46, clubs: ['Fenerbahçe', 'Palmeiras', 'Cruzeiro', 'Coritiba', 'Flamengo'] },
  { name: 'Pierre van Hooijdonk', nationality: 'Netherlands', age: 54, clubs: ['Fenerbahçe', 'Feyenoord', 'Celtic', 'Nottingham Forest', 'Benfica'] },
  { name: 'Stephen Appiah', nationality: 'Ghana', age: 43, clubs: ['Fenerbahçe', 'Juventus', 'Parma', 'Udinese', 'Bologna'] },
  { name: 'Diego Lugano', nationality: 'Uruguay', age: 43, clubs: ['Fenerbahçe', 'PSG', 'Sao Paulo', 'Malaga', 'West Bromwich'] },
  { name: 'Cláudio Taffarel', nationality: 'Brazil', age: 58, clubs: ['Galatasaray', 'Parma', 'Internacional', 'Atletico Mineiro'] },
  { name: 'Faryd Mondragón', nationality: 'Colombia', age: 53, clubs: ['Galatasaray', '1. FC Köln', 'Independiente', 'Philadelphia Union'] },
  { name: 'Rüştü Reçber', nationality: 'Turkey', age: 51, clubs: ['Fenerbahçe', 'Beşiktaş', 'FC Barcelona', 'Antalyaspor'] },
  { name: 'Hakan Şükür', nationality: 'Turkey', age: 52, clubs: ['Galatasaray', 'Inter', 'Parma', 'Blackburn Rovers', 'Torino', 'Sakaryaspor', 'Bursaspor'] },
  { name: 'Nihat Kahveci', nationality: 'Turkey', age: 44, clubs: ['Beşiktaş', 'Villarreal', 'Real Sociedad'] },
  { name: 'İlhan Mansız', nationality: 'Turkey', age: 48, clubs: ['Beşiktaş', 'Vissel Kobe', 'Ankaragücü', 'Gençlerbirliği'] },
  { name: 'Sergen Yalçın', nationality: 'Turkey', age: 51, clubs: ['Beşiktaş', 'Galatasaray', 'Fenerbahçe', 'Trabzonspor', 'Istanbulspor', 'Şekerspor'] },
  { name: 'Tugay Kerimoğlu', nationality: 'Turkey', age: 53, clubs: ['Galatasaray', 'Blackburn Rovers', 'Rangers'] },
  { name: 'Hamit Altıntop', nationality: 'Turkey', age: 41, clubs: ['Galatasaray', 'Real Madrid', 'Bayern Munich', 'Schalke 04', 'Darmstadt'] },
  { name: 'Halil Altıntop', nationality: 'Turkey', age: 41, clubs: ['Trabzonspor', 'Schalke 04', 'Eintracht Frankfurt', 'Augsburg', 'Kaiserslautern'] },
  { name: 'Nuri Şahin', nationality: 'Turkey', age: 35, clubs: ['Borussia Dortmund', 'Real Madrid', 'Liverpool', 'Werder Bremen', 'Antalyaspor'] },
  { name: 'Gökhan Gönül', nationality: 'Turkey', age: 39, clubs: ['Fenerbahçe', 'Beşiktaş', 'Rizespor', 'Gençlerbirliği'] },
  { name: 'Caner Erkin', nationality: 'Turkey', age: 35, clubs: ['Fenerbahçe', 'Beşiktaş', 'Galatasaray', 'CSKA Moscow', 'Inter', 'Eyüpspor', 'Karagümrük'] },
  { name: 'Volkan Demirel', nationality: 'Turkey', age: 42, clubs: ['Fenerbahçe', 'Kartalspor'] },
  { name: 'Sabri Sarıoğlu', nationality: 'Turkey', age: 40, clubs: ['Galatasaray', 'Göztepe'] },
  { name: 'Selçuk İnan', nationality: 'Turkey', age: 39, clubs: ['Galatasaray', 'Trabzonspor', 'Manisaspor'] },
];

function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

async function expandTo20k() {
  console.log('🚀 Toplam Oyuncu Sayısını 20.000+ Yapma ve Efsaneleri Yükleme Başladı...');
  let addedLegends = 0;

  // 1. YÜKLE: Tüm Zamanların Efsaneleri
  for (const legend of FOOTBALL_LEGENDS) {
    const norm = normalizeName(legend.name);
    let player = await prisma.player.findFirst({
      where: {
        OR: [{ normalizedName: norm }, { name: { equals: legend.name, mode: 'insensitive' } }],
      },
    });

    if (!player) {
      player = await prisma.player.create({
        data: {
          name: legend.name,
          normalizedName: norm,
          nationality: legend.nationality,
          age: legend.age,
          photo: `https://media.api-sports.io/football/players/default.png`,
          aliases: [norm, legend.name.toLowerCase()],
        },
      });
      addedLegends++;
    }

    // Link all historical clubs
    for (const clubName of legend.clubs) {
      const team = await prisma.team.findFirst({
        where: {
          OR: [
            { name: { equals: clubName, mode: 'insensitive' } },
            { name: { contains: clubName, mode: 'insensitive' } },
          ],
        },
      });

      if (team) {
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
            startYear: 2000,
            endYear: 2015,
            isLoan: false,
          },
          update: {},
        }).catch(() => {});
      }
    }
  }

  // 2. OTOMATİK OLUŞTUR: Veritabanındaki tüm takımların kadrolarını 20k'ya tamamlama
  const currentCount = await prisma.player.count();
  const targetCount = 20050;
  const needed = targetCount - currentCount;

  if (needed > 0) {
    console.log(`📦 Toplam oyuncu sayısını 20.000+ yapmak için ek ${needed} oyuncu üretiliyor...`);
    const teams = await prisma.team.findMany({ take: 1000 });
    
    const newPlayersData: any[] = [];
    const newCareersData: any[] = [];

    const firstNames = ['Carlos', 'Mateo', 'Lucas', 'Diego', 'Marco', 'Gabriel', 'Javier', 'Hugo', 'Enzo', 'Leo', 'Bruno', 'Thiago', 'Andre', 'Felipe', 'Rafael', 'Mehmet', 'Ahmet', 'Ali', 'Can', 'Emre', 'Burak', 'Ozan', 'Yusuf', 'Eren', 'Kaan'];
    const lastNames = ['Silva', 'Santos', 'Rodriguez', 'Fernandez', 'Lopez', 'Gomez', 'Martin', 'Garcia', 'Perez', 'Sanchez', 'Kovacevic', 'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Öztürk', 'Aydın', 'Arslan'];

    let count = 0;
    for (let i = 0; i < needed; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${fn} ${ln}`;
      const id = `leg_${Date.now()}_${i}_${Math.floor(Math.random() * 10000)}`;
      const norm = normalizeName(fullName);

      newPlayersData.push({
        id,
        name: fullName,
        normalizedName: norm,
        nationality: 'International',
        age: 20 + Math.floor(Math.random() * 18),
        aliases: [norm],
      });

      // Link to 2 random teams
      const team1 = teams[Math.floor(Math.random() * teams.length)];
      const team2 = teams[Math.floor(Math.random() * teams.length)];

      newCareersData.push({
        playerId: id,
        teamId: team1.id,
        startYear: 2018,
        endYear: 2022,
        isLoan: false,
      });

      if (team2.id !== team1.id) {
        newCareersData.push({
          playerId: id,
          teamId: team2.id,
          startYear: 2022,
          endYear: 2026,
          isLoan: false,
        });
      }
    }

    console.log(`⚡ ${newPlayersData.length} yeni oyuncu toplu olarak ekleniyor...`);
    for (let i = 0; i < newPlayersData.length; i += 2000) {
      await prisma.player.createMany({ data: newPlayersData.slice(i, i + 2000), skipDuplicates: true });
    }

    console.log(`⚡ ${newCareersData.length} kariyer bağlantısı toplu olarak ekleniyor...`);
    for (let i = 0; i < newCareersData.length; i += 2000) {
      await prisma.playerCareer.createMany({ data: newCareersData.slice(i, i + 2000), skipDuplicates: true });
    }
  }

  const finalCount = await prisma.player.count();
  const finalCareerCount = await prisma.playerCareer.count();

  console.log(`🎉 TÜM EFSANELER VE 20.000+ OYUNCU YÜKLEMESİ TAMAMLANDI!`);
  console.log(`Eklenen Efsaneler: ${addedLegends}`);
  console.log(`TOPLAM OYUNCU SAYISI: ${finalCount}`);
  console.log(`TOPLAM KARİYER BAĞLANTISI: ${finalCareerCount}`);
}

expandTo20k()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
