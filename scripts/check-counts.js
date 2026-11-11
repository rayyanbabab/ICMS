const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function checkCounts() {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');
  const models = [...schema.matchAll(/^model\s+(\w+)\s+\{/gm)].map(m => m[1]);
  
  console.log('Counting rows across all ' + models.length + ' models in Neon database...\n');
  const results = [];
  for (const m of models) {
    const delegate = m.charAt(0).toLowerCase() + m.slice(1);
    try {
      if (prisma[delegate]) {
        const count = await prisma[delegate].count();
        results.push({ model: m, count });
      } else {
        results.push({ model: m, count: 'NO_DELEGATE' });
      }
    } catch(err) {
      results.push({ model: m, count: 'ERR: ' + err.message });
    }
  }

  const populated = results.filter(r => typeof r.count === 'number' && r.count > 0);
  const empty = results.filter(r => r.count === 0);

  console.log('=== POPULATED TABLES (' + populated.length + ') ===');
  populated.forEach(p => console.log('  ' + p.model.padEnd(28) + ': ' + p.count + ' rows'));

  console.log('\n=== EMPTY TABLES (' + empty.length + ') ===');
  empty.forEach(e => console.log('  ' + e.model.padEnd(28) + ': 0 rows'));
}

checkCounts().catch(console.error).finally(() => prisma.$disconnect());

