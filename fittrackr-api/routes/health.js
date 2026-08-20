const express = require("express");
const router = express.Router();
const db = require("../db");

// Reports how the API is configured to reach Postgres and what the
// connection actually does. Never returns the password.
router.get("/db", async (req, res) => {
  const report = {
    databaseUrlSet: Boolean(process.env.DATABASE_URL),
    jwtSecretSet: Boolean(process.env.JWT_SECRET),
    target: null,
    connected: false,
    error: null,
  };

  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      report.target = {
        host: parsed.hostname,
        port: parsed.port || "5432",
        user: parsed.username,
        database: parsed.pathname.replace("/", ""),
        looksLikePooler: parsed.hostname.includes("pooler.supabase.com"),
      };
    } catch (err) {
      report.error = `DATABASE_URL is not a valid URL: ${err.message}`;
      return res.status(500).json(report);
    }
  } else {
    report.target = {
      host: process.env.DB_HOST || "(unset)",
      port: process.env.DB_PORT || "5432",
      user: process.env.DB_USER || "(unset)",
      database: process.env.DB_NAME || "(unset)",
      looksLikePooler: false,
    };
  }

  try {
    const result = await db.query("SELECT NOW() AS now");
    report.connected = true;
    report.serverTime = result.rows[0].now;

    const tables = await db.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
    );
    report.tables = tables.rows.map((row) => row.table_name);

    return res.json(report);
  } catch (err) {
    report.error = { code: err.code || null, message: err.message };
    return res.status(500).json(report);
  }
});

module.exports = router;
