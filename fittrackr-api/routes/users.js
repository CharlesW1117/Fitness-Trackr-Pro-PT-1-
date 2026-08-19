const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db"); // adjust path if your db file is elsewhere

// POST /api/users/register (already exists)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
    username,
    hashedPassword,
  ]);
  res.json({ message: "User registered successfully" });
});

// ✅ POST /api/users/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await db.query("SELECT * FROM users WHERE username=$1", [
    username,
  ]);
  const user = result.rows[0];

  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({ token });
});

module.exports = router;
