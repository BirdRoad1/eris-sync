import { Client } from 'pg';
import fs from 'fs';
import process from 'process';
import path from 'path';
import readline from 'readline/promises';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

try {
  await import('dotenv/config');
} catch {
  //
}

const MIGRATIONS_DIR = './migrations/';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('No DATABASE_URL env variable');
  process.exit();
}

const db = new Client({
  connectionString: dbUrl
});

await db.connect();

if (!fs.existsSync(MIGRATIONS_DIR)) {
  console.log('No migrations/ folder found');
  process.exit();
}

await db.query(
  `CREATE TABLE IF NOT EXISTS _migrations (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
migration_name TEXT UNIQUE NOT NULL,
applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
);

if (process.argv.length === 3) {
  const cmd = process.argv[2];
  if (cmd === 'create') {
    const name = await rl.question('Enter a name for the migration: ');
    const formattedName = name
      .toLowerCase()
      .trim()
      .replaceAll(/[ .]/g, '_')
      .replaceAll(/[^a-z0-9_]/g, '');

    const migrationFile = path.join(
      MIGRATIONS_DIR,
      `${Date.now()}-${formattedName}.sql`
    );

    if (fs.existsSync(migrationFile)) {
      console.log(
        `Failed! The migration file ${migrationFile} already exists!`
      );
      process.exit();
    }
    await fs.openSync(migrationFile, 'wx');

    console.log(`Migration created at ${path.resolve(migrationFile)}`);
  } else if (cmd === 'reset') {
    const response = await rl.question(
      'Are you sure you want to reset the database? '
    );

    if (['y', 'yes'].includes(response.toLowerCase())) {
      await db.query(
        `DROP SCHEMA public CASCADE;
CREATE SCHEMA public;`
      );
      console.log('Schema dropped successfully!');
    }
  } else {
    console.log('Invalid command');
  }
  process.exit();
}

const migrations = fs.readdirSync(MIGRATIONS_DIR);

if (migrations.length === 0) {
  console.log('Warning: no migrations');
}

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
});

migrations.sort(collator.compare);

for (const migration of migrations) {
  if (!migration.endsWith('.sql')) {
    console.error('Invalid non-sql migration file:', migration);
    continue;
  }

  const migrationName = migration.split('.')[0];

  const fullPath = path.join(MIGRATIONS_DIR, migration);
  try {
    if (
      (
        await db.query(
          'SELECT COUNT(*) as count FROM _migrations WHERE migration_name=$1::text',
          [migrationName]
        )
      ).rows[0].count > 0
    ) {
      continue;
    }

    console.log(`Executing migration ${fullPath}`);
    const sql = fs.readFileSync(fullPath, 'utf-8');
    if (sql.length === 0) {
      console.log('Warning: skipped empty migration: ' + fullPath);
      continue;
    }

    await db.query('BEGIN');
    await db.query(sql);
    await db.query('COMMIT');
    await db.query(
      'INSERT INTO _migrations (migration_name) VALUES ($1::text)',
      [migrationName]
    );
  } catch (err) {
    console.error('Migration failed! Rolling back!', err);
    await db.query('ROLLBACK');
    process.exit(1);
  }
}

console.log('Done!');

rl.close();
await db.end();
