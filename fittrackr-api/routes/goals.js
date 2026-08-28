const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db");

// ✅ Get all goals for the logged‑in user
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         g.id,
         g.name,
         g.description,
         g.target,
         (SELECT p.progress_value
            FROM progress p
           WHERE p.goal_id = g.id
           ORDER BY p.created_at DESC
           LIMIT 1) AS latest_progress
       FROM goals g
       WHERE g.user_id = $1
       ORDER BY g.id`,
      [req.user.id],
    );
    console.log(`Fetched ${result.rowCount} goals for user ${req.user.id}`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching goals:", err.code, err.message);
    res.status(500).json({ error: `Failed to fetch goals: ${err.message}` });
  }
});

// ✅ Add a new goal (includes target)
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, target } = req.body;
    const result = await db.query(
      "INSERT INTO goals (name, description, target, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, target, req.user.id],
    );
    console.log(
      `✅ Added goal "${name}" with target ${target} for user ${req.user.id}`,
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding goal:", err.code, err.message);
    res.status(500).json({ error: `Failed to add goal: ${err.message}` });
  }
});

// ✅ Delete a goal
router.delete("/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM goals WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);
    console.log(`🗑️ Deleted goal ID ${req.params.id} for user ${req.user.id}`);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting goal:", err.code, err.message);
    res.status(500).json({ error: `Failed to delete goal: ${err.message}` });
  }
});

// ✅ Update a goal
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, description, target } = req.body;
    const result = await db.query(
      "UPDATE goals SET name = $1, description = $2, target = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [name, description, target, req.params.id, req.user.id],
    );
    console.log(`✏️ Updated goal ID ${req.params.id} for user ${req.user.id}`);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating goal:", err.code, err.message);
    res.status(500).json({ error: `Failed to update goal: ${err.message}` });
  }
});

module.exports = router;
