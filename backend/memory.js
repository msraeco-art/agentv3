
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

await pool.query(`
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  workspace TEXT,
  role TEXT,
  content TEXT
);
`);

export async function saveMessage(workspace, role, content) {
  await pool.query(
    "INSERT INTO messages (workspace, role, content) VALUES ($1,$2,$3)",
    [workspace, role, content]
  );
}

export async function loadMessages(workspace, limit = 20) {
  const res = await pool.query(
    "SELECT role, content FROM messages WHERE workspace=$1 ORDER BY id DESC LIMIT $2",
    [workspace, limit]
  );
  return res.rows.reverse();
}
