export let pool;

import pkg from "pg";
const { Pool } = pkg;

export async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  const sslOption = process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false };
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslOption,
  });

  // Retry connecting a few times (useful on platforms where DB may not be immediately available)
  let connected = false;
  for (let i = 0; i < 6; i++) {
    try {
      await pool.query('SELECT 1');
      connected = true;
      break;
    } catch (err) {
      console.warn(`Database not ready, retrying... (${i + 1}/6)`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  if (!connected) {
    throw new Error('Unable to connect to the database after multiple attempts');
  }

  // Ensure tables exist. vectors.vector is stored as JSONB for portability.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      workspace TEXT,
      role TEXT,
      content TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vectors (
      id SERIAL PRIMARY KEY,
      workspace TEXT,
      text TEXT,
      vector JSONB
    );
  `);
}

export async function saveMessage(workspace, role, content) {
  if (!pool) throw new Error('Database not initialized');
  await pool.query(
    'INSERT INTO messages (workspace, role, content) VALUES ($1,$2,$3)',
    [workspace, role, content]
  );
}

export async function loadMessages(workspace, limit = 20) {
  if (!pool) throw new Error('Database not initialized');
  const res = await pool.query(
    'SELECT role, content FROM messages WHERE workspace=$1 ORDER BY id DESC LIMIT $2',
    [workspace, limit]
  );
  return res.rows.reverse();
}