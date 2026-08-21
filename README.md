# Fitness Trackr Pro

Fitness Trackr Pro (FitTrackr Pro) is a full-stack web app for setting fitness goals, logging your progress against them, and visualizing your improvement over time.

## What the app does

- **Create an account and sign in** — Register with a username and password, then log in to access your personal dashboard. Sessions are secured with JSON Web Tokens (JWT).
- **Set fitness goals** — Create goals with a name, description, and a target value (for example miles, reps, or glasses of water).
- **Manage your goals** — Edit or delete goals at any time from the dashboard.
- **Log progress** — Record progress entries against each goal, with a value and optional notes.
- **Visualize improvement** — View a chart of your logged progress for a goal against its target, so you can see how you're trending.
- **Stay motivated** — Motivational toast messages celebrate each time you log progress.

## Architecture

The project is split into two independently-run apps:

| App | Directory | Stack | Default port |
| --- | --- | --- | --- |
| Frontend | `fittrackr-frontend` | React (Create React App), React Router, Chart.js | 3001 (dev) |
| API | `fittrackr-api` | Node.js, Express 5, PostgreSQL (`pg`), JWT, bcrypt | 3000 |

Data is stored in a PostgreSQL database. The schema (`users`, `goals`, `progress`) lives in `fittrackr-api/schema.sql`.

## Getting started (local development)

### Prerequisites

- Node.js 18+ and npm
- A running PostgreSQL instance

### 1. Set up the database

Create a database and load the schema:

```bash
createdb fittrackr
psql -d fittrackr -f fittrackr-api/schema.sql
```

### 2. Configure and run the API

Create `fittrackr-api/.env` with your database and JWT settings. Either provide a single `DATABASE_URL`:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/fittrackr
JWT_SECRET=change-me
PORT=3000
```

or the individual connection fields:

```bash
DB_USER=your_user
DB_HOST=localhost
DB_NAME=fittrackr
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=change-me
PORT=3000
```

Then install dependencies and start the server:

```bash
cd fittrackr-api
npm install
node server.js
```

The API listens on `http://localhost:3000`. You can check database connectivity at `GET /api/health/db`.

### 3. Configure and run the frontend

Point the frontend at your API via `REACT_APP_API_URL` and start it on port 3001 (the API's CORS allowlist already includes `http://localhost:3001`):

```bash
cd fittrackr-frontend
npm install
PORT=3001 REACT_APP_API_URL=http://localhost:3000 npm start
```

Open `http://localhost:3001` in your browser.

## API overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/users/register` | Create a new user |
| `POST` | `/api/users/login` | Log in and receive a JWT |
| `GET` | `/api/goals` | List the current user's goals |
| `POST` | `/api/goals` | Create a goal |
| `PUT` | `/api/goals/:id` | Update a goal |
| `DELETE` | `/api/goals/:id` | Delete a goal |
| `GET` | `/api/progress/:goal_id` | List progress entries for a goal |
| `POST` | `/api/progress` | Add a progress entry |
| `DELETE` | `/api/progress/:id` | Delete a progress entry |
| `GET` | `/api/health/db` | Report API/database connectivity |

All goal and progress endpoints require an `Authorization: Bearer <token>` header.
