# FitTrackr Pro

A fitness goal-tracking web app split into two independently-run projects:

- `fittrackr-api` — Express 5 REST API (JWT auth, bcrypt) backed by PostgreSQL via `pg`.
- `fittrackr-frontend` — Create React App (react-scripts 5) single-page app.

## Cursor Cloud specific instructions

### Services & how to run them

| Service | Directory | Run command | Port | Notes |
| --- | --- | --- | --- | --- |
| API | `fittrackr-api` | `node server.js` | 3000 | Reads config from `fittrackr-api/.env`. Needs PostgreSQL running. No hot reload — restart the process after changing server code. |
| Frontend | `fittrackr-frontend` | `PORT=3001 REACT_APP_API_URL=http://localhost:3000 BROWSER=none npm start` | 3001 | CRA dev server with hot reload. |

Run each service in its own long-lived (tmux) terminal.

### PostgreSQL (required for the API)

PostgreSQL 16 is installed in the base environment along with a `charl` role, a `fittrackr` database, and the schema from `fittrackr-api/schema.sql`. These persist in the environment snapshot, but the server process does not, so start it each boot:

```
sudo pg_ctlcluster 16 main start
```

If the role/database are ever missing (fresh machine), recreate them to match `fittrackr-api/.env`:

```
sudo -u postgres psql -c "CREATE ROLE charl LOGIN PASSWORD 'Basketball88';"
sudo -u postgres createdb -O charl fittrackr
PGPASSWORD=Basketball88 psql -h localhost -U charl -d fittrackr -f fittrackr-api/schema.sql
```

Verify DB connectivity at any time via the API health endpoint: `curl http://localhost:3000/api/health/db`.

### Ports & CORS gotchas

- The API and CRA both default to port 3000, so run the frontend on 3001. The API's CORS allowlist already includes `http://localhost:3001`, so no extra config is needed for that pairing.
- The frontend must be pointed at the local API via `REACT_APP_API_URL=http://localhost:3000`. The committed `fittrackr-frontend/.env` points at a hosted Render URL; shell env vars passed to `npm start` override it (react-scripts does not overwrite existing process env vars). CRA only reads `REACT_APP_*` values at process start, so restart the dev server after changing them.

### Auth flow (used by the frontend)

The frontend uses `POST /api/users/register` and `POST /api/users/login` (see `fittrackr-frontend/src/api.js`). Note there is also a separate `POST /api/auth/login` route whose JWT omits the user `id`; the app does not use it. Goal/progress routes require an `Authorization: Bearer <token>` header.

### Tests / lint / build

- Frontend lint runs automatically via `react-scripts` during `npm start`/`npm run build`.
- `cd fittrackr-frontend && CI=true npm test` currently fails to run the one boilerplate test (`src/App.test.js`) because of a `react-router-dom` v7 + `react-scripts` 5 Jest resolver incompatibility (`Cannot find module 'react-router/dom'`). This is a pre-existing dependency issue, not an environment problem.
- The API has no test or lint scripts configured.
