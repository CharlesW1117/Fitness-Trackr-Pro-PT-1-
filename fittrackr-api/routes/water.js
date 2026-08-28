const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Log a water intake entry
router.post("/", auth, async (req, res) => {
  try {
    const amount = parseInt(req.body.amount_ml, 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "amount_ml must be a positive number" });
    }

    const result = await db.query(
      "INSERT INTO water_log (user_id, amount_ml) VALUES ($1, $2) RETURNING *",
      [req.user.id, amount],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error logging water:", err.code, err.message);
    res.status(500).json({ error: `Failed to log water: ${err.message}` });
  }
});

// Today's total and individual entries for the logged-in user
router.get("/today", auth, async (req, res) => {
  try {
    const entries = await db.query(
      `SELECT id, amount_ml, logged_at
         FROM water_log
        WHERE user_id = $1
          AND logged_at >= date_trunc('day', NOW())
        ORDER BY logged_at DESC`,
      [req.user.id],
    );

    const total = entries.rows.reduce((sum, row) => sum + row.amount_ml, 0);
    res.status(200).json({ total_ml: total, entries: entries.rows });
  } catch (err) {
    console.error("Error fetching today's water:", err.code, err.message);
    res.status(500).json({ error: `Failed to fetch water: ${err.message}` });
  }
});

// Daily totals for the last N days (default 7), oldest first
router.get("/history", auth, async (req, res) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 90);
    const result = await db.query(
      `SELECT to_char(date_trunc('day', logged_at), 'YYYY-MM-DD') AS day,
              SUM(amount_ml)::int AS total_ml
         FROM water_log
        WHERE user_id = $1
          AND logged_at >= date_trunc('day', NOW()) - ($2::int - 1) * INTERVAL '1 day'
        GROUP BY 1
        ORDER BY 1 ASC`,
      [req.user.id, days],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching water history:", err.code, err.message);
    res.status(500).json({ error: `Failed to fetch water history: ${err.message}` });
  }
});

// Delete a water entry
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM water_log WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Water entry not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting water:", err.code, err.message);
    res.status(500).json({ error: `Failed to delete water: ${err.message}` });
  }
});

module.exports = router;
