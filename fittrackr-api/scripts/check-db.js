// Local connectivity check. Run with:
//   DATABASE_URL="postgresql://..." node scripts/check-db.js
// Prints the target and the exact driver error. Never prints the password.
const { Pool } = require("pg");

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(url);
} catch (err) {
  console.error(`DATABASE_URL is not a valid URL: ${err.message}`);
  process.exit(1);
}

console.log(`host:     ${parsed.hostname}`);
console.log(`port:     ${parsed.port || "5432"}`);
console.log(`user:     ${parsed.username}`);
console.log(`database: ${parsed.pathname.replace("/", "")}`);

const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

(async () => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    console.log(`\nCONNECTED. Server time: ${result.rows[0].now}`);

    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
    );
    console.log(
      `Tables: ${tables.rows.map((r) => r.table_name).join(", ") || "(none)"}`,
    );
  } catch (err) {
    console.error(`\nFAILED. code=${err.code || "n/a"} message=${err.message}`);
  } finally {
    await pool.end().catch(() => {});
  }
})();
