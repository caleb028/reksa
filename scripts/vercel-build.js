const { execSync } = require('child_process');

console.log('====================================================');
console.log('A&E (Ardhi & Estates) — Automated Vercel Build & Database Setup');
console.log('====================================================');

// 1. Ensure DATABASE_URL fallback exists so Prisma never fails during Vercel build
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
  console.log('[A&E] Setting default fallback DATABASE_URL="file:./dev.db"');
} else {
  console.log('[A&E] Using configured DATABASE_URL');
}

// 2. Ensure SESSION_SECRET fallback exists for JWT/cookie auth
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = 'reksa_production_session_secret_32_chars_fallback_key';
  console.log('[A&E] Setting default fallback SESSION_SECRET');
}

// 3. Generate Prisma Client
console.log('[A&E] Generating Prisma Client (with Linux & Native engines)...');
try {
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
  console.log('[A&E] Prisma Client generated successfully.');
} catch (err) {
  console.error('[A&E] Error generating Prisma Client:', err.message);
  process.exit(1);
}

// 4. If using local SQLite file, initialize schema and seed demo records
if (process.env.DATABASE_URL.startsWith('file:')) {
  try {
    console.log('[A&E] Initializing database schema via db push...');
    execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit', env: process.env });

    console.log('[A&E] Seeding properties, verification records, and pricing tariffs...');
    execSync('node prisma/seed.js', { stdio: 'inherit', env: process.env });
    execSync('node scripts/seed-pricing.js', { stdio: 'inherit', env: process.env });
    console.log('[A&E] Database seeded successfully.');
  } catch (err) {
    console.warn('[A&E] Local SQLite setup warning (non-fatal):', err.message);
  }
}

// 5. Build Next.js
console.log('[A&E] Compiling Next.js application...');
try {
  execSync('npx next build', { stdio: 'inherit', env: process.env });
  console.log('[A&E] Build completed successfully.');
} catch (err) {
  console.error('[A&E] Next.js compilation error:', err.message);
  process.exit(1);
}
