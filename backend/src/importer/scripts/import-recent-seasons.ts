import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { TransfermarktService } from '../transfermarkt.service';

async function runRecentSeasonsImport() {
  console.log('🚀 Executing: 2024 - 2026 Season Player & Transfer Importer...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const tmService = app.get(TransfermarktService);

  try {
    const recentStarsAndTransfers = [
      // 2024-2026 Süper Lig Recent Transfers & Squad Stars
      { name: 'Victor Osimhen', teams: [{ name: 'VfL Wolfsburg' }, { name: 'Charleroi' }, { name: 'Lille' }, { name: 'Napoli' }, { name: 'Galatasaray' }] },
      { name: 'Gabriel Sara', teams: [{ name: 'Sao Paulo' }, { name: 'Norwich City' }, { name: 'Galatasaray' }] },
      { name: 'Roland Sallai', teams: [{ name: 'Puskas Akademia' }, { name: 'Palermo' }, { name: 'APOEL Nicosia' }, { name: 'SC Freiburg' }, { name: 'Galatasaray' }] },
      { name: 'Elias Jelert', teams: [{ name: 'FC Copenhagen' }, { name: 'Galatasaray' }] },
      { name: 'Hakim Ziyech', teams: [{ name: 'Heerenveen' }, { name: 'Twente' }, { name: 'Ajax' }, { name: 'Chelsea' }, { name: 'Galatasaray' }] },
      { name: 'Davinson Sanchez', teams: [{ name: 'Atletico Nacional' }, { name: 'Ajax' }, { name: 'Tottenham' }, { name: 'Galatasaray' }] },
      { name: 'Wilfried Zaha', teams: [{ name: 'Crystal Palace' }, { name: 'Manchester United' }, { name: 'Galatasaray' }, { name: 'Lyon' }] },
      { name: 'Tanguy Ndombele', teams: [{ name: 'Amiens' }, { name: 'Lyon' }, { name: 'Tottenham' }, { name: 'Napoli' }, { name: 'Galatasaray' }, { name: 'Nice' }] },
      { name: 'Youssef En-Nesyri', teams: [{ name: 'Malaga' }, { name: 'Leganes' }, { name: 'Sevilla' }, { name: 'Fenerbahce' }] },
      { name: 'Sofyan Amrabat', teams: [{ name: 'Utrecht' }, { name: 'Feyenoord' }, { name: 'Club Brugge' }, { name: 'Hellas Verona' }, { name: 'Fiorentina' }, { name: 'Manchester United' }, { name: 'Fenerbahce' }] },
      { name: 'Allan Saint-Maximin', teams: [{ name: 'Saint-Etienne' }, { name: 'Monaco' }, { name: 'Nice' }, { name: 'Newcastle' }, { name: 'Al Ahli' }, { name: 'Fenerbahce' }] },
      { name: 'Caglar Soyuncu', teams: [{ name: 'Altinordu' }, { name: 'SC Freiburg' }, { name: 'Leicester City' }, { name: 'Atletico Madrid' }, { name: 'Fenerbahce' }] },
      { name: 'Filip Kostic', teams: [{ name: 'Radnicki Nis' }, { name: 'Groningen' }, { name: 'VfB Stuttgart' }, { name: 'Hamburger SV' }, { name: 'Eintracht Frankfurt' }, { name: 'Juventus' }, { name: 'Fenerbahce' }] },
      { name: 'Sebastian Szymanski', teams: [{ name: 'Legia Warsaw' }, { name: 'Dynamo Moscow' }, { name: 'Feyenoord' }, { name: 'Fenerbahce' }] },
      { name: 'Rodrigo Becao', teams: [{ name: 'Bahia' }, { name: 'CSKA Moscow' }, { name: 'Udinese' }, { name: 'Fenerbahce' }] },
      { name: 'Alexander Djiku', teams: [{ name: 'Bastia' }, { name: 'Caen' }, { name: 'Strasbourg' }, { name: 'Fenerbahce' }] },
      { name: 'Dominik Livakovic', teams: [{ name: 'NK Zagreb' }, { name: 'Dinamo Zagreb' }, { name: 'Fenerbahce' }] },
      { name: 'Cengiz Under', teams: [{ name: 'Altinordu' }, { name: 'Istanbul Basaksehir' }, { name: 'AS Roma' }, { name: 'Leicester City' }, { name: 'Marseille' }, { name: 'Fenerbahce' }] },
      { name: 'Ciro Immobile', teams: [{ name: 'Juventus' }, { name: 'Genoa' }, { name: 'Torino' }, { name: 'Borussia Dortmund' }, { name: 'Sevilla' }, { name: 'Lazio' }, { name: 'Besiktas' }] },
      { name: 'Rafa Silva', teams: [{ name: 'Feirense' }, { name: 'Braga' }, { name: 'Benfica' }, { name: 'Besiktas' }] },
      { name: 'Joao Mario', teams: [{ name: 'Sporting CP' }, { name: 'Inter Milan' }, { name: 'West Ham' }, { name: 'Lokomotiv Moscow' }, { name: 'Benfica' }, { name: 'Besiktas' }] },
      { name: 'Gabriel Paulista', teams: [{ name: 'Vitoria' }, { name: 'Villarreal' }, { name: 'Arsenal' }, { name: 'Valencia' }, { name: 'Atletico Madrid' }, { name: 'Besiktas' }] },
      { name: 'Felix Uduokhai', teams: [{ name: '1860 Munich' }, { name: 'VfL Wolfsburg' }, { name: 'Augsburg' }, { name: 'Besiktas' }] },
      { name: 'Al-Musrati', teams: [{ name: 'Vitoria Guimaraes' }, { name: 'Rio Ave' }, { name: 'Braga' }, { name: 'Besiktas' }] },
      { name: 'Milot Rashica', teams: [{ name: 'Vitesse' }, { name: 'Werder Bremen' }, { name: 'Norwich City' }, { name: 'Galatasaray' }, { name: 'Besiktas' }] },
      { name: 'Alex Oxlade-Chamberlain', teams: [{ name: 'Southampton' }, { name: 'Arsenal' }, { name: 'Liverpool' }, { name: 'Besiktas' }] },
      { name: 'Ante Rebic', teams: [{ name: 'Split' }, { name: 'Fiorentina' }, { name: 'Eintracht Frankfurt' }, { name: 'AC Milan' }, { name: 'Besiktas' }, { name: 'Lecce' }] },
      { name: 'Ernest Muci', teams: [{ name: 'Tirana' }, { name: 'Legia Warsaw' }, { name: 'Besiktas' }] },
      { name: 'Simon Banza', teams: [{ name: 'Lens' }, { name: 'Famalicao' }, { name: 'Braga' }, { name: 'Trabzonspor' }] },
      { name: 'Denis Dragus', teams: [{ name: 'Viitorul Constanta' }, { name: 'Standard Liege' }, { name: 'Genoa' }, { name: 'Gaziantep FK' }, { name: 'Trabzonspor' }] },
      { name: 'Stefan Savic', teams: [{ name: 'BSK Borca' }, { name: 'Partizan' }, { name: 'Manchester City' }, { name: 'Fiorentina' }, { name: 'Atletico Madrid' }, { name: 'Trabzonspor' }] },
      { name: 'Nicolas Pepe', teams: [{ name: 'Angers' }, { name: 'Lille' }, { name: 'Arsenal' }, { name: 'Nice' }, { name: 'Trabzonspor' }, { name: 'Villarreal' }] },
      { name: 'Paul Onuachu', teams: [{ name: 'FC Midtjylland' }, { name: 'Genk' }, { name: 'Southampton' }, { name: 'Trabzonspor' }] },
      { name: 'Thomas Meunier', teams: [{ name: 'Club Brugge' }, { name: 'Paris Saint Germain' }, { name: 'Borussia Dortmund' }, { name: 'Trabzonspor' }, { name: 'Lille' }] },

      // 2024-2026 World Blockbuster Transfers
      { name: 'Kylian Mbappe', teams: [{ name: 'Monaco' }, { name: 'Paris Saint Germain' }, { name: 'Real Madrid' }] },
      { name: 'Jude Bellingham', teams: [{ name: 'Birmingham City' }, { name: 'Borussia Dortmund' }, { name: 'Real Madrid' }] },
      { name: 'Harry Kane', teams: [{ name: 'Tottenham' }, { name: 'Leicester City' }, { name: 'Bayern Munich' }] },
      { name: 'Erling Haaland', teams: [{ name: 'Molde' }, { name: 'Red Bull Salzburg' }, { name: 'Borussia Dortmund' }, { name: 'Manchester City' }] },
      { name: 'Declan Rice', teams: [{ name: 'West Ham' }, { name: 'Arsenal' }] },
      { name: 'Moises Caicedo', teams: [{ name: 'Independiente del Valle' }, { name: 'Brighton' }, { name: 'Beerschot' }, { name: 'Chelsea' }] },
      { name: 'Julian Alvarez', teams: [{ name: 'River Plate' }, { name: 'Manchester City' }, { name: 'Atletico Madrid' }] },
      { name: 'Dani Olmo', teams: [{ name: 'Dinamo Zagreb' }, { name: 'RB Leipzig' }, { name: 'Barcelona' }] },
      { name: 'Teun Koopmeiners', teams: [{ name: 'AZ Alkmaar' }, { name: 'Atalanta' }, { name: 'Juventus' }] },
      { name: 'Douglas Luiz', teams: [{ name: 'Vasco da Gama' }, { name: 'Girona' }, { name: 'Aston Villa' }, { name: 'Juventus' }] },
      { name: 'Leny Yoro', teams: [{ name: 'Lille' }, { name: 'Manchester United' }] },
      { name: 'Joshua Zirkzee', teams: [{ name: 'Bayern Munich' }, { name: 'Parma' }, { name: 'Anderlecht' }, { name: 'Bologna' }, { name: 'Manchester United' }] },
      { name: 'Riccardo Calafiori', teams: [{ name: 'AS Roma' }, { name: 'Genoa' }, { name: 'Basel' }, { name: 'Bologna' }, { name: 'Arsenal' }] },
      { name: 'Ilkay Gundogan', teams: [{ name: 'Nurnberg' }, { name: 'Borussia Dortmund' }, { name: 'Manchester City' }, { name: 'Barcelona' }] },
      { name: 'Joao Felix', teams: [{ name: 'Benfica' }, { name: 'Atletico Madrid' }, { name: 'Chelsea' }, { name: 'Barcelona' }] },
      { name: 'Joao Cancelo', teams: [{ name: 'Benfica' }, { name: 'Valencia' }, { name: 'Inter Milan' }, { name: 'Juventus' }, { name: 'Manchester City' }, { name: 'Bayern Munich' }, { name: 'Barcelona' }, { name: 'Al Hilal' }] },
      { name: 'Neymar Jr', teams: [{ name: 'Santos' }, { name: 'Barcelona' }, { name: 'Paris Saint Germain' }, { name: 'Al Hilal' }] },
      { name: 'Karim Benzema', teams: [{ name: 'Lyon' }, { name: 'Real Madrid' }, { name: 'Al Ittihad' }] },
      { name: 'Sadio Mane', teams: [{ name: 'Metz' }, { name: 'Red Bull Salzburg' }, { name: 'Southampton' }, { name: 'Liverpool' }, { name: 'Bayern Munich' }, { name: 'Al Nassr' }] },
    ];

    for (const p of recentStarsAndTransfers) {
      await tmService.importTransfermarktPlayerCareer(p.name, p.teams);
    }

    console.log('✨ 2024 - 2026 Recent Seasons Data Import Completed Successfully!');
  } catch (error) {
    console.error('❌ Error during 2024-2026 import:', error);
  } finally {
    await app.close();
  }
}

runRecentSeasonsImport();
