# Huff House Budget

## Project Overview
Personal budget tracker application built with Node.js/Express backend and vanilla JavaScript frontend. Tracks income and expenses with SQLite persistence and automatic daily backups.

**Version:** 2.0.0  
**Main entry point:** `server.js`  
**Default port:** 3001

---

## Tech Stack
- **Backend:** Node.js (≥18), Express 4.21.0
- **Database:** SQLite with better-sqlite3 11.5.0
- **Frontend:** Vanilla HTML/CSS/JavaScript (SPA)
- **Process management:** macOS LaunchAgent (optional, auto-start at login)

---

## Project Structure

```
budget-website/
├── server.js                          # Express entry point, auto-migrates DB, serves SPA
├── package.json
│
├── data/
│   ├── app.db                         # SQLite database (created on first run)
│   ├── backups/                       # Nightly timestamped backups (last 30 kept)
│   ├── server.log                     # LaunchAgent stdout (if installed)
│   └── server.error.log               # LaunchAgent stderr (if installed)
│
├── public/                            # Static assets served at /
│   ├── index.html                     # SPA shell with sidebar and main content area
│   ├── app.js                         # All client logic: router, views, charts, filters
│   └── style.css                      # Dark theme, responsive design
│
├── routes/
│   └── api.js                         # JSON API endpoints: /api/income, /api/expenses, etc.
│
└── scripts/
    ├── migrate.js                     # Database schema setup (idempotent, auto-runs on start)
    ├── seed.js                        # Inserts starter data (one-time)
    ├── install-service.sh             # Install as macOS LaunchAgent (auto-start at login)
    └── uninstall-service.sh           # Remove LaunchAgent service
```

---

## Quick Start

### Install & Run Locally
```bash
npm install
npm run migrate              # Initialize database schema
npm run seed                 # Load starter data (one-time)
npm start                    # Start server at http://localhost:3001/
```

### Development
```bash
npm run dev                  # Auto-reload via node --watch (PORT=3001)
```

### Auto-Start as Service (macOS)
```bash
./scripts/install-service.sh    # Install LaunchAgent, auto-start at login
./scripts/uninstall-service.sh  # Remove LaunchAgent
```

---

## Key Features
- Track income and expenses
- SQLite persistence with automatic daily backups (keeps last 30)
- Single-page app with responsive design
- Optional service mode for always-on budget tracking
- Database auto-migration on server startup

---

## Database
- **Location:** `data/app.db` (auto-created on first run)
- **Backups:** `data/backups/app-{timestamp}.db` (daily snapshots, last 30 retained)
- **Logs:** `data/server.log` and `data/server.error.log` (when running as service)

---

## API Endpoints
See `routes/api.js` for full endpoint documentation. Main routes include:
- `/api/income` — Income entries
- `/api/expenses` — Expense entries
- Standard CRUD operations via POST/GET/PUT/DELETE

---

## Notes for Multi-Project Workspace
This is the **Huff House Budget** project. When working in a workspace with multiple projects:
- This project lives in `budget-website/`
- Database is local and non-destructive (daily backups in `data/backups/`)
- Frontend is at `http://localhost:3001/` when running
- Development mode: use `npm run dev` for hot-reload
