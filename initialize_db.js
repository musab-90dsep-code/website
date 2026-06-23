import { execSync } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Dynamically check and install pg module if not present
async function ensurePgInstalled() {
  try {
    await import('pg');
  } catch (e) {
    console.log("Installing 'pg' database driver...");
    execSync('npm install pg --no-save', { stdio: 'inherit' });
  }
}

async function run() {
  await ensurePgInstalled();
  const pg = (await import('pg')).default;

  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error("Error: Missing POSTGRES_URL_NON_POOLING or POSTGRES_URL environment variables in .env file.");
    process.exit(1);
  }

  console.log("Connection string configured.");
  const client = new pg.Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Connecting to PostgreSQL...");
    await client.connect();
    console.log("Connected successfully!");

    console.log("Reading schema.sql...");
    const schemaSql = fs.readFileSync('schema.sql', 'utf8');

    console.log("Executing schema SQL queries...");
    await client.query(schemaSql);
    console.log("All tables, policies, and seed data created and configured successfully!");
  } catch (err) {
    console.error("Database initialization failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
