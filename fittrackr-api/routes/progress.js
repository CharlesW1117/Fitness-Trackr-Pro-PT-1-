const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Add progress entry
router.post("/", auth, async (req, res) => {
  try {
    const { goal_id, progress_value, notes } = req.body;
    const result = await db.query(
      "INSERT INTO progress (goal_id, progress_value, notes) VALUES ($1, $2, $3) RETURNING *",
      [goal_id, progress_value, notes],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding progress:", err.message);
    res.status(500).json({ error: "Failed to add progress" });
  }
});

// Get progress for a goal
router.get("/:goal_id", auth, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM progress WHERE goal_id = $1 ORDER BY created_at DESC",
      [req.params.goal_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching progress:", err.message);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});


// Delete progress entry
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM progress WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Progress entry not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting progress:", err.message);
    res.status(500).json({ error: "Failed to delete progress" });
  }
});

module.exports = router;
