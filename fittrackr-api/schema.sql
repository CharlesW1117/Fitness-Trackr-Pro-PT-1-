-- Schema for Fitness Trackr Pro.
-- Run this against a fresh database (for example in the Supabase SQL Editor).

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target INTEGER,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  progress_value INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS water_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS body_measurements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight NUMERIC(6, 2) NOT NULL,
  body_fat NUMERIC(5, 2),
  chest NUMERIC(6, 2),
  waist NUMERIC(6, 2),
  hips NUMERIC(6, 2),
  arms NUMERIC(6, 2),
  notes TEXT,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS progress_goal_id_idx ON progress(goal_id);
CREATE INDEX IF NOT EXISTS water_log_user_id_logged_at_idx ON water_log(user_id, logged_at);
CREATE INDEX IF NOT EXISTS body_measurements_user_id_measured_at_idx ON body_measurements(user_id, measured_at);
