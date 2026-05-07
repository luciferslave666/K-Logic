import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set. Database features will be disabled.');
}

// Only create the function if we have a URL, otherwise a placeholder that throws informative error
const sql = databaseUrl 
  ? neon(databaseUrl) 
  : async () => { throw new Error('Database connection string is missing.'); };

export default sql;

/**
 * Leaderboard schema:
 * CREATE TABLE leaderboard (
 *   id SERIAL PRIMARY KEY,
 *   username VARCHAR(50) NOT NULL,
 *   score INTEGER NOT NULL,
 *   mode VARCHAR(20) NOT NULL,
 *   level INTEGER NOT NULL,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 */
