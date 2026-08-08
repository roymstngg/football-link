import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { TransfermarktService } from '../transfermarkt.service';

async function runImportAllTransfers() {
  console.log('\n==================================================');
  console.log('🚀 STARTING COMPREHENSIVE ALL-TRANSFER DATA CRAWLER');
  console.log('==================================================\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const tmService = app.get(TransfermarktService);

  try {
    // 1. Comprehensive list of current & historical transfer moves across major teams
    const allLatestTransfers = [
      // Galatasaray
      { name: 'Victor Osimhen', teams: [{ name: 'VfL Wolfsburg' }, { name: 'Charleroi' }, { name: 'Lille' }, { name: 'Napoli' }, { name: 'Galatasaray' }] },
      { name: 'Gabriel Sara', teams: [{ name: 'Sao Paulo' }, { name: 'Norwich City' }, { name: 'Galatasaray' }] },
      { name: 'Roland Sallai', teams: [{ name: 'Puskas Akademia' }, { name: 'Palermo' }, { name: 'APOEL Nicosia' }, { name: 'SC Freiburg' }, { name: 'Galatasaray' }] },
      { name: 'Elias Jelert', teams: [{ name: 'FC Copenhagen' }, { name: 'Galatasaray' }] },
      { name: 'Hakim Ziyech', teams: [{ name: 'Heerenveen' }, { name: 'Twente' }, { name: 'Ajax' }, { name: 'Chelsea' }, { name: 'Galatasaray' }] },
      { name: 'Davinson Sanchez', teams: [{ name: 'Atletico Nacional' }, { name: 'Ajax' }, { name: 'Tottenham' }, { name: 'Galatasaray' }] },
      { name: 'Wilfried Zaha', teams: [{ name: 'Crystal Palace' }, { name: 'Manchester United' }, { name: 'Galatasaray' }, { name: 'Lyon' }] },
      { name: 'Mauro Icardi', teams: [{ name: 'Sampdoria' }, { name: 'Inter Milan' }, { name: 'Paris Saint Germain' }, { name: 'Galatasaray' }] },
      { name: 'Dries Mertens', teams: [{ name: 'Gent' }, { name: 'AGOVV' }, { name: 'Utrecht' }, { name: 'PSV Eindhoven' }, { name: 'Napoli' }, { name: 'Galatasaray' }] },
      { name: 'Lucas Torreira', teams: [{ name: 'Pescara' }, { name: 'Sampdoria' }, { name: 'Arsenal' }, { name: 'Atletico Madrid' }, { name: 'Fiorentina' }, { name: 'Galatasaray' }] },
      { name: 'Kerem Akturkoglu', teams: [{ name: 'Basaksehir' }, { name: 'Bodrumspor' }, { name: 'Karacabey' }, { name: 'Erzincanspor' }, { name: 'Galatasaray' }, { name: 'Benfica' }] },
      { name: 'Baris Alper Yilmaz', teams: [{ name: 'Ankara Demirspor' }, { name: 'Keciorengucu' }, { name: 'Galatasaray' }] },

      // Fenerbahce
      { name: 'Youssef En-Nesyri', teams: [{ name: 'Malaga' }, { name: 'Leganes' }, { name: 'Sevilla' }, { name: 'Fenerbahce' }] },
      { name: 'Sofyan Amrabat', teams: [{ name: 'Utrecht' }, { name: 'Feyenoord' }, { name: 'Club Brugge' }, { name: 'Hellas Verona' }, { name: 'Fiorentina' }, { name: 'Manchester United' }, { name: 'Fenerbahce' }] },
      { name: 'Allan Saint-Maximin', teams: [{ name: 'Saint-Etienne' }, { name: 'Monaco' }, { name: 'Nice' }, { name: 'Newcastle' }, { name: 'Al Ahli' }, { name: 'Fenerbahce' }] },
      { name: 'Edin Dzeko', teams: [{ name: 'Zeljeznicar' }, { name: 'Teplice' }, { name: 'VfL Wolfsburg' }, { name: 'Manchester City' }, { name: 'AS Roma' }, { name: 'Inter Milan' }, { name: 'Fenerbahce' }] },
      { name: 'Dusan Tadic', teams: [{ name: 'Vojvodina' }, { name: 'Groningen' }, { name: 'Twente' }, { name: 'Southampton' }, { name: 'Ajax' }, { name: 'Fenerbahce' }] },
      { name: 'Fred', teams: [{ name: 'Internacional' }, { name: 'Shakhtar Donetsk' }, { name: 'Manchester United' }, { name: 'Fenerbahce' }] },
      { name: 'Sebastian Szymanski', teams: [{ name: 'Legia Warsaw' }, { name: 'Dynamo Moscow' }, { name: 'Feyenoord' }, { name: 'Fenerbahce' }] },
      { name: 'Ferdi Kadioglu', teams: [{ name: 'NEC Nijmegen' }, { name: 'Fenerbahce' }, { name: 'Brighton' }] },
      { name: 'Irfan Can Kahveci', teams: [{ name: 'Genclerbirligi' }, { name: 'Hacettepe' }, { name: 'Istanbul Basaksehir' }, { name: 'Fenerbahce' }] },
      { name: 'Cenk Tosun', teams: [{ name: 'Eintracht Frankfurt' }, { name: 'Gaziantepspor' }, { name: 'Besiktas' }, { name: 'Everton' }, { name: 'Crystal Palace' }, { name: 'Fenerbahce' }] },
      { name: 'Filip Kostic', teams: [{ name: 'Radnicki Nis' }, { name: 'Groningen' }, { name: 'VfB Stuttgart' }, { name: 'Hamburger SV' }, { name: 'Eintracht Frankfurt' }, { name: 'Juventus' }, { name: 'Fenerbahce' }] },

      // Besiktas
      { name: 'Ciro Immobile', teams: [{ name: 'Juventus' }, { name: 'Genoa' }, { name: 'Torino' }, { name: 'Borussia Dortmund' }, { name: 'Sevilla' }, { name: 'Lazio' }, { name: 'Besiktas' }] },
      { name: 'Rafa Silva', teams: [{ name: 'Feirense' }, { name: 'Braga' }, { name: 'Benfica' }, { name: 'Besiktas' }] },
      { name: 'Joao Mario', teams: [{ name: 'Sporting CP' }, { name: 'Inter Milan' }, { name: 'West Ham' }, { name: 'Lokomotiv Moscow' }, { name: 'Benfica' }, { name: 'Besiktas' }] },
      { name: 'Gabriel Paulista', teams: [{ name: 'Vitoria' }, { name: 'Villarreal' }, { name: 'Arsenal' }, { name: 'Valencia' }, { name: 'Atletico Madrid' }, { name: 'Besiktas' }] },
      { name: 'Milot Rashica', teams: [{ name: 'Vitesse' }, { name: 'Werder Bremen' }, { name: 'Norwich City' }, { name: 'Galatasaray' }, { name: 'Besiktas' }] },
      { name: 'Ernest Muci', teams: [{ name: 'Tirana' }, { name: 'Legia Warsaw' }, { name: 'Besiktas' }] },
      { name: 'Semih Kilicsoy', teams: [{ name: 'Besiktas' }] },
      { name: 'Gedson Fernandes', teams: [{ name: 'Benfica' }, { name: 'Tottenham' }, { name: 'Galatasaray' }, { name: 'Rizespor' }, { name: 'Besiktas' }] },

      // Trabzonspor
      { name: 'Simon Banza', teams: [{ name: 'Lens' }, { name: 'Famalicao' }, { name: 'Braga' }, { name: 'Trabzonspor' }] },
      { name: 'Denis Dragus', teams: [{ name: 'Viitorul Constanta' }, { name: 'Standard Liege' }, { name: 'Genoa' }, { name: 'Gaziantep FK' }, { name: 'Trabzonspor' }] },
      { name: 'Stefan Savic', teams: [{ name: 'BSK Borca' }, { name: 'Partizan' }, { name: 'Manchester City' }, { name: 'Fiorentina' }, { name: 'Atletico Madrid' }, { name: 'Trabzonspor' }] },
      { name: 'Edin Visca', teams: [{ name: 'Zeljeznicar' }, { name: 'Istanbul Basaksehir' }, { name: 'Trabzonspor' }] },
      { name: 'Ugurcan Cakir', teams: [{ name: '1461 Trabzon' }, { name: 'Trabzonspor' }] },

      // Premier League Blockbuster Transfers
      { name: 'Declan Rice', teams: [{ name: 'West Ham' }, { name: 'Arsenal' }] },
      { name: 'Moises Caicedo', teams: [{ name: 'Independiente del Valle' }, { name: 'Brighton' }, { name: 'Beerschot' }, { name: 'Chelsea' }] },
      { name: 'Enzo Fernandez', teams: [{ name: 'River Plate' }, { name: 'Defense y Justicia' }, { name: 'Benfica' }, { name: 'Chelsea' }] },
      { name: 'Cole Palmer', teams: [{ name: 'Manchester City' }, { name: 'Chelsea' }] },
      { name: 'Erling Haaland', teams: [{ name: 'Molde' }, { name: 'Red Bull Salzburg' }, { name: 'Borussia Dortmund' }, { name: 'Manchester City' }] },
      { name: 'Kevin De Bruyne', teams: [{ name: 'Genk' }, { name: 'Werder Bremen' }, { name: 'Chelsea' }, { name: 'VfL Wolfsburg' }, { name: 'Manchester City' }] },
      { name: 'Mohamed Salah', teams: [{ name: 'El Mokawloon' }, { name: 'Basel' }, { name: 'Chelsea' }, { name: 'Fiorentina' }, { name: 'AS Roma' }, { name: 'Liverpool' }] },
      { name: 'Virgil van Dijk', teams: [{ name: 'Groningen' }, { name: 'Celtic' }, { name: 'Southampton' }, { name: 'Liverpool' }] },
      { name: 'Alexis Mac Allister', teams: [{ name: 'Argentinos Juniors' }, { name: 'Boca Juniors' }, { name: 'Brighton' }, { name: 'Liverpool' }] },
      { name: 'Dominik Szoboszlai', teams: [{ name: 'FC Liefering' }, { name: 'Red Bull Salzburg' }, { name: 'RB Leipzig' }, { name: 'Liverpool' }] },
      { name: 'Bruno Fernandes', teams: [{ name: 'Novara' }, { name: 'Udinese' }, { name: 'Sampdoria' }, { name: 'Sporting CP' }, { name: 'Manchester United' }] },
      { name: 'Rasmus Hojlund', teams: [{ name: 'FC Copenhagen' }, { name: 'Sturm Graz' }, { name: 'Atalanta' }, { name: 'Manchester United' }] },
      { name: 'Andre Onana', teams: [{ name: 'Ajax' }, { name: 'Inter Milan' }, { name: 'Manchester United' }] },
      { name: 'Alexander Isak', teams: [{ name: 'AIK' }, { name: 'Borussia Dortmund' }, { name: 'Willem II' }, { name: 'Real Sociedad' }, { name: 'Newcastle' }] },
      { name: 'Bruno Guimaraes', teams: [{ name: 'Athletico Paranaense' }, { name: 'Lyon' }, { name: 'Newcastle' }] },
      { name: 'Ollie Watkins', teams: [{ name: 'Exeter City' }, { name: 'Weston-super-Mare' }, { name: 'Brentford' }, { name: 'Aston Villa' }] },

      // La Liga Blockbuster Transfers
      { name: 'Kylian Mbappe', teams: [{ name: 'Monaco' }, { name: 'Paris Saint Germain' }, { name: 'Real Madrid' }] },
      { name: 'Jude Bellingham', teams: [{ name: 'Birmingham City' }, { name: 'Borussia Dortmund' }, { name: 'Real Madrid' }] },
      { name: 'Vinicius Junior', teams: [{ name: 'Flamengo' }, { name: 'Real Madrid' }] },
      { name: 'Rodrygo', teams: [{ name: 'Santos' }, { name: 'Real Madrid' }] },
      { name: 'Endrick', teams: [{ name: 'Palmeiras' }, { name: 'Real Madrid' }] },
      { name: 'Lamine Yamal', teams: [{ name: 'Barcelona' }] },
      { name: 'Robert Lewandowski', teams: [{ name: 'Znicz Pruszkow' }, { name: 'Lech Poznan' }, { name: 'Borussia Dortmund' }, { name: 'Bayern Munich' }, { name: 'Barcelona' }] },
      { name: 'Raphinha', teams: [{ name: 'Vitoria Guimaraes' }, { name: 'Sporting CP' }, { name: 'Rennes' }, { name: 'Leeds United' }, { name: 'Barcelona' }] },
      { name: 'Pedri', teams: [{ name: 'Las Palmas' }, { name: 'Barcelona' }] },
      { name: 'Gavi', teams: [{ name: 'Barcelona' }] },
      { name: 'Antoine Griezmann', teams: [{ name: 'Real Sociedad' }, { name: 'Atletico Madrid' }, { name: 'Barcelona' }] },
      { name: 'Julian Alvarez', teams: [{ name: 'River Plate' }, { name: 'Manchester City' }, { name: 'Atletico Madrid' }] },
      { name: 'Conor Gallagher', teams: [{ name: 'Charlton Athletic' }, { name: 'Swansea City' }, { name: 'West Bromwich Albion' }, { name: 'Crystal Palace' }, { name: 'Chelsea' }, { name: 'Atletico Madrid' }] },

      // Serie A Blockbuster Transfers
      { name: 'Lautaro Martinez', teams: [{ name: 'Racing Club' }, { name: 'Inter Milan' }] },
      { name: 'Marcus Thuram', teams: [{ name: 'Sochaux' }, { name: 'Guingamp' }, { name: 'Borussia Monchengladbach' }, { name: 'Inter Milan' }] },
      { name: 'Nicolo Barella', teams: [{ name: 'Cagliari' }, { name: 'Como' }, { name: 'Inter Milan' }] },
      { name: 'Hakan Calhanoglu', teams: [{ name: 'Karlsruher SC' }, { name: 'Hamburger SV' }, { name: 'Bayer Leverkusen' }, { name: 'AC Milan' }, { name: 'Inter Milan' }] },
      { name: 'Rafael Leao', teams: [{ name: 'Sporting CP' }, { name: 'Lille' }, { name: 'AC Milan' }] },
      { name: 'Christian Pulisic', teams: [{ name: 'Borussia Dortmund' }, { name: 'Chelsea' }, { name: 'AC Milan' }] },
      { name: 'Teun Koopmeiners', teams: [{ name: 'AZ Alkmaar' }, { name: 'Atalanta' }, { name: 'Juventus' }] },
      { name: 'Dusan Vlahovic', teams: [{ name: 'Partizan' }, { name: 'Fiorentina' }, { name: 'Juventus' }] },
      { name: 'Khvicha Kvaratskhelia', teams: [{ name: 'Dinamo Tbilisi' }, { name: 'Rustavi' }, { name: 'Lokomotiv Moscow' }, { name: 'Rubin Kazan' }, { name: 'Dinamo Batumi' }, { name: 'Napoli' }] },
      { name: 'Romelu Lukaku', teams: [{ name: 'Anderlecht' }, { name: 'Chelsea' }, { name: 'West Bromwich Albion' }, { name: 'Everton' }, { name: 'Manchester United' }, { name: 'Inter Milan' }, { name: 'AS Roma' }, { name: 'Napoli' }] },
      { name: 'Paulo Dybala', teams: [{ name: 'Instituto' }, { name: 'Palermo' }, { name: 'Juventus' }, { name: 'AS Roma' }] },

      // Bundesliga Blockbuster Transfers
      { name: 'Harry Kane', teams: [{ name: 'Tottenham' }, { name: 'Leicester City' }, { name: 'Bayern Munich' }] },
      { name: 'Jamal Musiala', teams: [{ name: 'Southampton' }, { name: 'Chelsea' }, { name: 'Bayern Munich' }] },
      { name: 'Leroy Sane', teams: [{ name: 'Schalke 04' }, { name: 'Manchester City' }, { name: 'Bayern Munich' }] },
      { name: 'Michael Olise', teams: [{ name: 'Reading' }, { name: 'Crystal Palace' }, { name: 'Bayern Munich' }] },
      { name: 'Florian Wirtz', teams: [{ name: 'FC Cologne' }, { name: 'Bayer Leverkusen' }] },
      { name: 'Granit Xhaka', teams: [{ name: 'Basel' }, { name: 'Borussia Monchengladbach' }, { name: 'Arsenal' }, { name: 'Bayer Leverkusen' }] },
      { name: 'Jeremie Frimpong', teams: [{ name: 'Manchester City' }, { name: 'Celtic' }, { name: 'Bayer Leverkusen' }] },
      { name: 'Serhou Guirassy', teams: [{ name: 'Laval' }, { name: 'Lille' }, { name: 'Auxerre' }, { name: 'FC Cologne' }, { name: 'Amiens' }, { name: 'Rennes' }, { name: 'VfB Stuttgart' }, { name: 'Borussia Dortmund' }] },
    ];

    let count = 0;
    for (const p of allLatestTransfers) {
      await tmService.importTransfermarktPlayerCareer(p.name, p.teams);
      count++;
    }

    console.log(`\n==================================================`);
    console.log(`✨ ALL LATEST TRANSFERS & PLAYERS IMPORTED SUCCESSFULLY (${count} players parsed)`);
    console.log(`==================================================\n`);
  } catch (error) {
    console.error('❌ Error during all transfers import:', error);
  } finally {
    await app.close();
  }
}

runImportAllTransfers();
