// =============================================================================
// db/seed.js — Database seeder for ResQGrid
// Creates the initial admin account only.
// Run with: node db/seed.js
// =============================================================================

import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

// Same setup as src/db/prisma.js — pg pool + adapter
const pool    = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

async function seed() {
  console.log('[seed] Starting...');

  // ---------------------------------------------------------------------------
  // 1. Create admin user
  //    bcrypt.hash(plainText, saltRounds) — saltRounds=10 is the standard
  //    The hash is what gets stored in DB — NEVER store plain passwords!
  // ---------------------------------------------------------------------------
  const passwordHash = await bcrypt.hash('Admin1234!', 10);

  await prisma.user.upsert({
    where:  { email: 'admin@resqgrid.local' },
    update: {},  // if user already exists, do nothing
    create: {
      id:           'a0000000-0000-0000-0000-000000000001',
      name:         'System Admin',
      email:        'admin@resqgrid.local',
      passwordHash, // bcrypt hash stored here
    },
  });
  console.log('[seed] ✓ Admin user: admin@resqgrid.local / Admin1234!');

  console.log('[seed] Done ✓');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] FATAL:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
