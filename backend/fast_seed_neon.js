const { PrismaClient } = require('@prisma/client');

const localDb = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres:postgres@localhost:5432/football_link?schema=public' } }
});

const neonDb = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_Zd61kgmUnvJa@ep-winter-union-ax0ybbso.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require' } }
});

async function main() {
  console.log('⚡ Starting Fast Seeding to Neon Cloud DB...');
  
  const players = await localDb.player.findMany();
  console.log(`📦 Copying ${players.length} Players...`);
  for (let i = 0; i < players.length; i += 2000) {
    const chunk = players.slice(i, i + 2000);
    await neonDb.player.createMany({ data: chunk, skipDuplicates: true });
    console.log(`✓ Players ${i + chunk.length} / ${players.length}`);
  }

  const careers = await localDb.playerCareer.findMany();
  console.log(`📦 Copying ${careers.length} Player Careers...`);
  for (let i = 0; i < careers.length; i += 2000) {
    const chunk = careers.slice(i, i + 2000);
    await neonDb.playerCareer.createMany({ data: chunk, skipDuplicates: true });
    console.log(`✓ Careers ${i + chunk.length} / ${careers.length}`);
  }

  console.log('🎉 FAST SEEDING COMPLETE!');
  console.log('Players in Neon:', await neonDb.player.count());
  console.log('Careers in Neon:', await neonDb.playerCareer.count());
}

main().catch(console.error).finally(() => {
  localDb.$disconnect();
  neonDb.$disconnect();
});
