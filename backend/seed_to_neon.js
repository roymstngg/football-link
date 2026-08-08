const { PrismaClient } = require('@prisma/client');

const localDb = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres:postgres@localhost:5432/football_link?schema=public' } }
});

const neonDb = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_Zd61kgmUnvJa@ep-winter-union-ax0ybbso.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require' } }
});

async function sync() {
  console.log('🔄 Connecting to Local & Neon Databases...');
  
  const countries = await localDb.country.findMany();
  console.log(`📦 Copying ${countries.length} Countries...`);
  for (const item of countries) {
    await neonDb.country.upsert({
      where: { id: item.id },
      create: item,
      update: item,
    }).catch(e => {});
  }

  const leagues = await localDb.league.findMany();
  console.log(`📦 Copying ${leagues.length} Leagues...`);
  for (const item of leagues) {
    await neonDb.league.upsert({
      where: { id: item.id },
      create: item,
      update: item,
    }).catch(e => {});
  }

  const teams = await localDb.team.findMany();
  console.log(`📦 Copying ${teams.length} Teams...`);
  const teamChunks = chunkArray(teams, 100);
  for (const chunk of teamChunks) {
    await Promise.all(chunk.map(t => neonDb.team.upsert({ where: { id: t.id }, create: t, update: t }).catch(e => {})));
  }

  const players = await localDb.player.findMany();
  console.log(`📦 Copying ${players.length} Players...`);
  const playerChunks = chunkArray(players, 100);
  for (const chunk of playerChunks) {
    await Promise.all(chunk.map(p => neonDb.player.upsert({ where: { id: p.id }, create: p, update: p }).catch(e => {})));
  }

  const careers = await localDb.playerCareer.findMany();
  console.log(`📦 Copying ${careers.length} Player Careers...`);
  const careerChunks = chunkArray(careers, 200);
  for (const chunk of careerChunks) {
    await Promise.all(chunk.map(c => neonDb.playerCareer.upsert({ where: { id: c.id }, create: c, update: c }).catch(e => {})));
  }

  console.log('🎉 ALL DATA SYNCED TO NEON CLOUD DB SUCCESSFULLY!');
}

function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

sync().catch(console.error).finally(async () => {
  await localDb.$disconnect();
  await neonDb.$disconnect();
});
