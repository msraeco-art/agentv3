
import pkg from "pg";
const { Pool } = pkg;

export let pool;

export async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  console.log("Connecting to database...");
  
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  // Test connection with retry logic
  let connected = false;
  for (let i = 0; i < 5; i++) {
    try {
      await pool.query('SELECT NOW()');
      connected = true;
      console.log("Database connection successful");
      break;
    } catch (err) {
      console.warn(`Database connection attempt ${i + 1}/5 failed:`, err.message);
      if (i < 4) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  if (!connected) {
    throw new Error("Failed to connect to database after 5 attempts");
  }

  // Create tables if they don't exist
  console.log("Creating tables if not exists...");
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      workspace TEXT,
      role TEXT,
      content TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("Database tables ready");
}

export async function saveMessage(workspace, role, content) {
  if (!pool) {
    throw new Error("Database not initialized");
  }
  
  await pool.query(
    "INSERT INTO messages (workspace, role, content) VALUES ($1, $2, $3)",
    [workspace, role, content]
  );
}

export async function loadMessages(workspace, limit = 20) {
  if (!pool) {
    throw new Error("Database not initialized");
  }
  
  const res = await pool.query(
    "SELECT role, content FROM messages WHERE workspace=$1 ORDER BY id DESC LIMIT $2",
    [workspace, limit]
  );
  
  return res.rows.reverse();
}
