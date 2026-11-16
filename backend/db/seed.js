// =============================================================================
// db/seed.js — Database seeder for ResQGrid
// Seeds 1 admin user and 5 sample incidents.
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

  // ---------------------------------------------------------------------------
  // 2. Create sample incidents
  //    upsert = insert if not found, skip if already exists (safe to re-run)
  // ---------------------------------------------------------------------------
  const incidents = [
    {
      id:           'c0000000-0000-0000-0000-000000000001',
      incidentCode: 'INC-SEED-0001',
      title:        'Severe Flooding in Assam',
      hazardType:   'flood',
      severity:     'critical',
      status:       'active',
      locationName: 'Guwahati, Assam',
      description:  'Severe flooding reported across Kamrup district. Multiple villages submerged.',
    },
    {
      id:           'c0000000-0000-0000-0000-000000000002',
      incidentCode: 'INC-SEED-0002',
      title:        'Cyclone Alert - Odisha Coast',
      hazardType:   'cyclone',
      severity:     'high',
      status:       'active',
      locationName: 'Puri, Odisha',
      description:  'Cyclonic storm expected to make landfall near Puri within 48 hours.',
    },
    {
      id:           'c0000000-0000-0000-0000-000000000003',
      incidentCode: 'INC-SEED-0003',
      title:        'Earthquake Tremors in Gujarat',
      hazardType:   'earthquake',
      severity:     'moderate',
      status:       'reported',
      locationName: 'Ahmedabad, Gujarat',
      description:  'Earthquake of magnitude 4.2 felt in Ahmedabad region.',
    },
    {
      id:           'c0000000-0000-0000-0000-000000000004',
      incidentCode: 'INC-SEED-0004',
      title:        'Landslide Reported in Uttarakhand',
      hazardType:   'landslide',
      severity:     'high',
      status:       'reported',
      locationName: 'Chamoli, Uttarakhand',
      description:  'Landslide blocking NH-7 near Chamoli. Multiple vehicles stranded.',
    },
    {
      id:           'c0000000-0000-0000-0000-000000000005',
      incidentCode: 'INC-SEED-0005',
      title:        'Forest Fire in Himachal Pradesh',
      hazardType:   'fire',
      severity:     'moderate',
      status:       'resolved',
      locationName: 'Shimla, Himachal Pradesh',
      description:  'Forest fire contained after 6-hour operation by fire department.',
    },
  ];

  for (const incident of incidents) {
    await prisma.incident.upsert({
      where:  { incidentCode: incident.incidentCode },
      update: {},
      create: incident,
    });
  }
  console.log('[seed] ✓ 5 sample incidents created');
  console.log('[seed] Done ✓');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] FATAL:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
