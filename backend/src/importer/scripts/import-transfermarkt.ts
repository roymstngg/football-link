import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { TransfermarktService } from '../transfermarkt.service';

async function run() {
  console.log('🚀 Executing: Transfermarkt Data Importer & Scraper...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const tmService = app.get(TransfermarktService);

  try {
    // List of iconic & legendary players to pull complete Transfermarkt careers for
    const iconicPlayers = [
      // Turkish Super Lig Icons & Legends
      { name: 'Burak Yilmaz', teams: [{ name: 'Antalyaspor' }, { name: 'Besiktas' }, { name: 'Manisaspor' }, { name: 'Fenerbahce' }, { name: 'Eskisehirspor' }, { name: 'Trabzonspor' }, { name: 'Galatasaray' }, { name: 'Beijing Guoan' }, { name: 'Lille' }, { name: 'Fortuna Sittard' }] },
      { name: 'Arda Turan', teams: [{ name: 'Galatasaray' }, { name: 'Manisaspor' }, { name: 'Atletico Madrid' }, { name: 'Barcelona' }, { name: 'Istanbul Basaksehir' }] },
      { name: 'Alex de Souza', teams: [{ name: 'Coritiba' }, { name: 'Palmeiras' }, { name: 'Parma' }, { name: 'Flamengo' }, { name: 'Cruzeiro' }, { name: 'Fenerbahce' }] },
      { name: 'Gheorghe Hagi', teams: [{ name: 'Farul Constanta' }, { name: 'Sportul Studentesc' }, { name: 'Steaua Bucuresti' }, { name: 'Real Madrid' }, { name: 'Brescia' }, { name: 'Barcelona' }, { name: 'Galatasaray' }] },
      { name: 'Gheorghe Popescu', teams: [{ name: 'Universitatea Craiova' }, { name: 'Steaua Bucuresti' }, { name: 'PSV Eindhoven' }, { name: 'Tottenham' }, { name: 'Barcelona' }, { name: 'Galatasaray' }, { name: 'Lecce' }, { name: 'Hannover 96' }] },
      { name: 'Claudio Taffarel', teams: [{ name: 'Internacional' }, { name: 'Parma' }, { name: 'Reggiana' }, { name: 'Atletico Mineiro' }, { name: 'Galatasaray' }] },
      { name: 'Mario Jardel', teams: [{ name: 'Vasco da Gama' }, { name: 'Gremio' }, { name: 'Porto' }, { name: 'Galatasaray' }, { name: 'Sporting CP' }, { name: 'Ancona' }, { name: 'Bolton' }] },
      { name: 'Wesley Sneijder', teams: [{ name: 'Ajax' }, { name: 'Real Madrid' }, { name: 'Inter Milan' }, { name: 'Galatasaray' }, { name: 'Nice' }, { name: 'Al Gharafa' }] },
      { name: 'Didier Drogba', teams: [{ name: 'Le Mans' }, { name: 'Guingamp' }, { name: 'Marseille' }, { name: 'Chelsea' }, { name: 'Shanghai Shenhua' }, { name: 'Galatasaray' }, { name: 'Montreal Impact' }] },
      { name: 'Radamel Falcao', teams: [{ name: 'River Plate' }, { name: 'Porto' }, { name: 'Atletico Madrid' }, { name: 'Monaco' }, { name: 'Manchester United' }, { name: 'Chelsea' }, { name: 'Galatasaray' }, { name: 'Rayo Vallecano' }] },
      { name: 'Samuel Eto\'o', teams: [{ name: 'Real Madrid' }, { name: 'Leganes' }, { name: 'Espanyol' }, { name: 'Mallorca' }, { name: 'Barcelona' }, { name: 'Inter Milan' }, { name: 'Anzhi' }, { name: 'Chelsea' }, { name: 'Everton' }, { name: 'Sampdoria' }, { name: 'Antalyaspor' }, { name: 'Konyaspor' }, { name: 'Qatar SC' }] },
      { name: 'Ricardo Quaresma', teams: [{ name: 'Sporting CP' }, { name: 'Barcelona' }, { name: 'Porto' }, { name: 'Inter Milan' }, { name: 'Chelsea' }, { name: 'Besiktas' }, { name: 'Al Ahli' }, { name: 'Kasimpasa' }, { name: 'Vitoria Guimaraes' }] },
      { name: 'Pepe', teams: [{ name: 'Maritimo' }, { name: 'Porto' }, { name: 'Real Madrid' }, { name: 'Besiktas' }] },
      { name: 'Anderson Talisca', teams: [{ name: 'Bahia' }, { name: 'Benfica' }, { name: 'Besiktas' }, { name: 'Guangzhou Evergrande' }, { name: 'Al Nassr' }] },
      { name: 'Vincent Aboubakar', teams: [{ name: 'Coton Sport' }, { name: 'Valenciennes' }, { name: 'Lorient' }, { name: 'Porto' }, { name: 'Besiktas' }, { name: 'Al Nassr' }] },
      { name: 'Mario Gomez', teams: [{ name: 'VfB Stuttgart' }, { name: 'Bayern Munich' }, { name: 'Fiorentina' }, { name: 'Besiktas' }, { name: 'VfL Wolfsburg' }] },
      { name: 'Pierre van Hooijdonk', teams: [{ name: 'NAC Breda' }, { name: 'Celtic' }, { name: 'Nottingham Forest' }, { name: 'Vitesse' }, { name: 'Benfica' }, { name: 'Feyenoord' }, { name: 'Fenerbahce' }] },
      { name: 'Dirk Kuyt', teams: [{ name: 'Utrecht' }, { name: 'Feyenoord' }, { name: 'Liverpool' }, { name: 'Fenerbahce' }] },
      { name: 'Stephen Appiah', teams: [{ name: 'Udinese' }, { name: 'Parma' }, { name: 'Brescia' }, { name: 'Juventus' }, { name: 'Fenerbahce' }, { name: 'Bologna' }, { name: 'Cesena' }] },
      { name: 'Nicolas Anelka', teams: [{ name: 'Paris Saint Germain' }, { name: 'Arsenal' }, { name: 'Real Madrid' }, { name: 'Liverpool' }, { name: 'Manchester City' }, { name: 'Fenerbahce' }, { name: 'Bolton' }, { name: 'Chelsea' }, { name: 'Juventus' }] },
      { name: 'Robin van Persie', teams: [{ name: 'Feyenoord' }, { name: 'Arsenal' }, { name: 'Manchester United' }, { name: 'Fenerbahce' }] },
      { name: 'Nani', teams: [{ name: 'Sporting CP' }, { name: 'Manchester United' }, { name: 'Fenerbahce' }, { name: 'Valencia' }, { name: 'Lazio' }, { name: 'Orlando City' }, { name: 'Venezia' }, { name: 'Melbourne Victory' }, { name: 'Adana Demirspor' }] },
      { name: 'Sergen Yalcin', teams: [{ name: 'Besiktas' }, { name: 'Istanbulspor' }, { name: 'Fenerbahce' }, { name: 'Galatasaray' }, { name: 'Trabzonspor' }, { name: 'Seker-Seker' }, { name: 'Eskisehirspor' }] },
      { name: 'Nihat Kahveci', teams: [{ name: 'Besiktas' }, { name: 'Real Sociedad' }, { name: 'Villarreal' }] },
      { name: 'Tugay Kerimoglu', teams: [{ name: 'Galatasaray' }, { name: 'Rangers' }, { name: 'Blackburn Rovers' }] },
      { name: 'Rustu Recber', teams: [{ name: 'Antalyaspor' }, { name: 'Fenerbahce' }, { name: 'Barcelona' }, { name: 'Besiktas' }] },
      { name: 'Hakan Sukur', teams: [{ name: 'Sakaryaspor' }, { name: 'Bursaspor' }, { name: 'Galatasaray' }, { name: 'Torino' }, { name: 'Inter Milan' }, { name: 'Parma' }, { name: 'Blackburn Rovers' }] },
      { name: 'Hakan Calhanoglu', teams: [{ name: 'Karlsruher SC' }, { name: 'Hamburger SV' }, { name: 'Bayer Leverkusen' }, { name: 'AC Milan' }, { name: 'Inter Milan' }] },
      { name: 'Emre Belozoglu', teams: [{ name: 'Galatasaray' }, { name: 'Inter Milan' }, { name: 'Newcastle' }, { name: 'Fenerbahce' }, { name: 'Atletico Madrid' }, { name: 'Istanbul Basaksehir' }] },
      { name: 'Caner Erkin', teams: [{ name: 'Manisaspor' }, { name: 'CSKA Moscow' }, { name: 'Galatasaray' }, { name: 'Fenerbahce' }, { name: 'Inter Milan' }, { name: 'Besiktas' }, { name: 'Karagumruk' }, { name: 'Istanbul Basaksehir' }] },
      { name: 'Mehmet Topal', teams: [{ name: 'Dardanelspor' }, { name: 'Galatasaray' }, { name: 'Valencia' }, { name: 'Fenerbahce' }, { name: 'Istanbul Basaksehir' }, { name: 'Besiktas' }] },
      { name: 'Gokhan Gonul', teams: [{ name: 'Genclerbirligi' }, { name: 'Hacettepe' }, { name: 'Fenerbahce' }, { name: 'Besiktas' }] },
      { name: 'Semih Senturk', teams: [{ name: 'Fenerbahce' }, { name: 'Izmirspor' }, { name: 'Antalyaspor' }, { name: 'Istanbul Basaksehir' }, { name: 'Eskisehirspor' }] },
      { name: 'Selcuk Inan', teams: [{ name: 'Dardanelspor' }, { name: 'Manisaspor' }, { name: 'Trabzonspor' }, { name: 'Galatasaray' }] },
      { name: 'Yusuf Yazici', teams: [{ name: 'Trabzonspor' }, { name: 'Lille' }, { name: 'CSKA Moscow' }, { name: 'Olympiacos' }] },
      { name: 'Cenk Tosun', teams: [{ name: 'Eintracht Frankfurt' }, { name: 'Gaziantepspor' }, { name: 'Besiktas' }, { name: 'Everton' }, { name: 'Crystal Palace' }, { name: 'Fenerbahce' }] },
      { name: 'Ryan Babel', teams: [{ name: 'Ajax' }, { name: 'Liverpool' }, { name: 'Hoffenheim' }, { name: 'Kasimpasa' }, { name: 'Besiktas' }, { name: 'Fulham' }, { name: 'Galatasaray' }, { name: 'Eyupspor' }] },
      { name: 'Michy Batshuayi', teams: [{ name: 'Standard Liege' }, { name: 'Marseille' }, { name: 'Chelsea' }, { name: 'Borussia Dortmund' }, { name: 'Valencia' }, { name: 'Crystal Palace' }, { name: 'Besiktas' }, { name: 'Fenerbahce' }, { name: 'Galatasaray' }] },
      { name: 'Mauro Icardi', teams: [{ name: 'Sampdoria' }, { name: 'Inter Milan' }, { name: 'Paris Saint Germain' }, { name: 'Galatasaray' }] },
      { name: 'Edin Dzeko', teams: [{ name: 'Zeljeznicar' }, { name: 'Teplice' }, { name: 'VfL Wolfsburg' }, { name: 'Manchester City' }, { name: 'AS Roma' }, { name: 'Inter Milan' }, { name: 'Fenerbahce' }] },
      { name: 'Dries Mertens', teams: [{ name: 'Gent' }, { name: 'AGOVV' }, { name: 'Utrecht' }, { name: 'PSV Eindhoven' }, { name: 'Napoli' }, { name: 'Galatasaray' }] },
      { name: 'Lucas Torreira', teams: [{ name: 'Pescara' }, { name: 'Sampdoria' }, { name: 'Arsenal' }, { name: 'Atletico Madrid' }, { name: 'Fiorentina' }, { name: 'Galatasaray' }] },
      { name: 'Fred', teams: [{ name: 'Internacional' }, { name: 'Shakhtar Donetsk' }, { name: 'Manchester United' }, { name: 'Fenerbahce' }] },
      { name: 'Dusan Tadic', teams: [{ name: 'Vojvodina' }, { name: 'Groningen' }, { name: 'Twente' }, { name: 'Southampton' }, { name: 'Ajax' }, { name: 'Fenerbahce' }] },
      { name: 'Ciro Immobile', teams: [{ name: 'Juventus' }, { name: 'Genoa' }, { name: 'Torino' }, { name: 'Borussia Dortmund' }, { name: 'Sevilla' }, { name: 'Lazio' }, { name: 'Besiktas' }] },
      { name: 'Victor Osimhen', teams: [{ name: 'VfL Wolfsburg' }, { name: 'Charleroi' }, { name: 'Lille' }, { name: 'Napoli' }, { name: 'Galatasaray' }] },

      // World Legends & All-Time Superstars
      { name: 'Cristiano Ronaldo', teams: [{ name: 'Sporting CP' }, { name: 'Manchester United' }, { name: 'Real Madrid' }, { name: 'Juventus' }, { name: 'Al Nassr' }] },
      { name: 'Lionel Messi', teams: [{ name: 'Barcelona' }, { name: 'Paris Saint Germain' }, { name: 'Inter Miami' }] },
      { name: 'Zinedine Zidane', teams: [{ name: 'Cannes' }, { name: 'Bordeaux' }, { name: 'Juventus' }, { name: 'Real Madrid' }] },
      { name: 'Ronaldinho', teams: [{ name: 'Gremio' }, { name: 'Paris Saint Germain' }, { name: 'Barcelona' }, { name: 'AC Milan' }, { name: 'Flamengo' }, { name: 'Atletico Mineiro' }, { name: 'Fluminense' }] },
      { name: 'Ronaldo Nazario', teams: [{ name: 'Cruzeiro' }, { name: 'PSV Eindhoven' }, { name: 'Barcelona' }, { name: 'Inter Milan' }, { name: 'Real Madrid' }, { name: 'AC Milan' }, { name: 'Corinthians' }] },
      { name: 'Thierry Henry', teams: [{ name: 'Monaco' }, { name: 'Juventus' }, { name: 'Arsenal' }, { name: 'Barcelona' }, { name: 'New York Red Bulls' }] },
      { name: 'Zlatan Ibrahimovic', teams: [{ name: 'Malmo' }, { name: 'Ajax' }, { name: 'Juventus' }, { name: 'Inter Milan' }, { name: 'Barcelona' }, { name: 'AC Milan' }, { name: 'Paris Saint Germain' }, { name: 'LA Galaxy' }, { name: 'Manchester United' }] },
      { name: 'Kaka', teams: [{ name: 'Sao Paulo' }, { name: 'AC Milan' }, { name: 'Real Madrid' }, { name: 'Orlando City' }] },
      { name: 'Andrea Pirlo', teams: [{ name: 'Brescia' }, { name: 'Inter Milan' }, { name: 'Reggina' }, { name: 'AC Milan' }, { name: 'Juventus' }, { name: 'New York City' }] },
      { name: 'Steven Gerrard', teams: [{ name: 'Liverpool' }, { name: 'LA Galaxy' }] },
      { name: 'Frank Lampard', teams: [{ name: 'West Ham' }, { name: 'Chelsea' }, { name: 'Manchester City' }, { name: 'New York City' }] },
      { name: 'David Beckham', teams: [{ name: 'Manchester United' }, { name: 'Preston North End' }, { name: 'Real Madrid' }, { name: 'LA Galaxy' }, { name: 'AC Milan' }, { name: 'Paris Saint Germain' }] },
      { name: 'Luis Figo', teams: [{ name: 'Sporting CP' }, { name: 'Barcelona' }, { name: 'Real Madrid' }, { name: 'Inter Milan' }] },
      { name: 'Clarence Seedorf', teams: [{ name: 'Ajax' }, { name: 'Sampdoria' }, { name: 'Real Madrid' }, { name: 'Inter Milan' }, { name: 'AC Milan' }, { name: 'Botafogo' }] },
      { name: 'Xavi Hernandez', teams: [{ name: 'Barcelona' }, { name: 'Al Sadd' }] },
      { name: 'Andres Iniesta', teams: [{ name: 'Barcelona' }, { name: 'Vissel Kobe' }, { name: 'Emirates Club' }] },
      { name: 'Luka Modric', teams: [{ name: 'Dinamo Zagreb' }, { name: 'Inter Zapresic' }, { name: 'Zrinjski Mostar' }, { name: 'Tottenham' }, { name: 'Real Madrid' }] },
      { name: 'Karim Benzema', teams: [{ name: 'Lyon' }, { name: 'Real Madrid' }, { name: 'Al Ittihad' }] },
      { name: 'Gareth Bale', teams: [{ name: 'Southampton' }, { name: 'Tottenham' }, { name: 'Real Madrid' }, { name: 'Los Angeles FC' }] },
      { name: 'Sergio Ramos', teams: [{ name: 'Sevilla' }, { name: 'Real Madrid' }, { name: 'Paris Saint Germain' }] },
      { name: 'Lukas Podolski', teams: [{ name: 'FC Cologne' }, { name: 'Bayern Munich' }, { name: 'Arsenal' }, { name: 'Inter Milan' }, { name: 'Galatasaray' }, { name: 'Vissel Kobe' }, { name: 'Antalyaspor' }, { name: 'Gornik Zabrze' }] },
      { name: 'Mesut Ozil', teams: [{ name: 'Schalke 04' }, { name: 'Werder Bremen' }, { name: 'Real Madrid' }, { name: 'Arsenal' }, { name: 'Fenerbahce' }, { name: 'Istanbul Basaksehir' }] },
      { name: 'Roberto Carlos', teams: [{ name: 'Uniao Sao Joao' }, { name: 'Palmeiras' }, { name: 'Inter Milan' }, { name: 'Real Madrid' }, { name: 'Fenerbahce' }, { name: 'Anzhi' }] },
    ];

    for (const p of iconicPlayers) {
      await tmService.importTransfermarktPlayerCareer(p.name, p.teams);
    }

    console.log('✨ Transfermarkt data import process completed successfully.');
  } catch (error) {
    console.error('❌ Error during import:transfermarkt:', error);
  } finally {
    await app.close();
  }
}

run();
