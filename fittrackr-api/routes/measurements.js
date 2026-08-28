const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Coerce an optional numeric field to a number or null.
function optionalNum(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// Add a body measurement entry (weight required, other fields optional)
router.post("/", auth, async (req, res) => {
  try {
    const weight = Number(req.body.weight);
    if (!Number.isFinite(weight) || weight <= 0) {
      return res.status(400).json({ error: "weight must be a positive number" });
    }

    const { body_fat, chest, waist, hips, arms, notes } = req.body;
    const result = await db.query(
      `INSERT INTO body_measurements
         (user_id, weight, body_fat, chest, waist, hips, arms, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        req.user.id,
        weight,
        optionalNum(body_fat),
        optionalNum(chest),
        optionalNum(waist),
        optionalNum(hips),
        optionalNum(arms),
        notes || null,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding measurement:", err.code, err.message);
    res.status(500).json({ error: `Failed to add measurement: ${err.message}` });
  }
});

// List the user's measurements, oldest first (chronological for charting)
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, weight, body_fat, chest, waist, hips, arms, notes, measured_at
         FROM body_measurements
        WHERE user_id = $1
        ORDER BY measured_at ASC, id ASC`,
      [req.user.id],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching measurements:", err.code, err.message);
    res
      .status(500)
      .json({ error: `Failed to fetch measurements: ${err.message}` });
  }
});

// Delete a measurement entry
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM body_measurements WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Measurement not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting measurement:", err.code, err.message);
    res
      .status(500)
      .json({ error: `Failed to delete measurement: ${err.message}` });
  }
});

module.exports = router;
