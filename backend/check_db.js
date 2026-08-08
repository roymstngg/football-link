const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const players = await prisma.player.count();
  const teams = await prisma.team.count();
  const careers = await prisma.playerCareer.count();
  console.log(`=== DB STATS ===`);
  console.log(`PLAYERS COUNT: ${players}`);
  console.log(`TEAMS COUNT: ${teams}`);
  console.log(`CAREERS COUNT: ${careers}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
