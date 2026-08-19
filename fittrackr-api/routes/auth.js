// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in database
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
