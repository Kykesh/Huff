# Huff House Budget

Personal budget tracker. Node.js + Express + SQLite on the back end,
plain HTML/CSS/vanilla-JS single-page app on the front end.

Runs locally at **http://localhost:3001/**.

## Folder layout

```
budget-website/
├── server.js              # Express entry point — auto-migrates, mounts API, serves SPA
├── package.json
├── README.md
│
├── data/
│   ├── app.db             # SQLite database (created on first run)
│   ├── backups/           # Nightly timestamped copies of app.db (last 30 kept)
│   ├── server.log         # stdout of the LaunchAgent process (if installed)
│   └── server.error.log   # stderr
│
├── public/                # Static assets served at /
│   ├── index.html         # SPA shell — sidebar + <main>
│   ├── app.js             # All client logic: router, views, charts, edits, filters
│   └── style.css          # Dark theme, responsive
│
├── routes/
│   └── api.js             # JSON API: /api/income, /api/expenses, etc.
│
└── scripts/
    ├── migrate.js                 # Creates tables (idempotent, auto-run on start)
    ├── seed.js                    # Inserts starter data
    ├── install-service.sh         # Install as a macOS LaunchAgent (auto-start at login)
    └── uninstall-service.sh       # Stop & remove the LaunchAgent
```

## Install & run

```sh
cd budget-website
npm install
npm run migrate
npm run seed         # one-time: load the starter rows
npm start            # serves http://localhost:3001/
```

### Always-on (recommended) — auto-start at login

```sh
./scripts/install-service.sh
```

Installs a macOS LaunchAgent so the server is up after every login/reboot,
even when VSCode is closed. Logs land in `data/server.log` and
`data/server.error.log`. To stop and remove:

```sh
./scripts/uninstall-service.sh
```

### Useful npm scripts

| Command          | What it does                                                    |
| ---------------- | --------------------------------------------------------------- |
| `npm start`      | Run the Express server on port 3001                             |
| `npm run dev`    | Same as start, with `node --watch` for auto-reload              |
| `npm run migrate`| Create/refresh the SQLite schema (`data/app.db`)                |
| `npm run seed`   | Insert starter data (skip if already seeded; `--force` to wipe) |

## API

All endpoints return JSON. CRUD pattern is the same across resources:

| Method | Path                            | Notes                        |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/api/all`                      | Full state in one fetch      |
| GET    | `/api/<resource>`               | List                         |
| POST   | `/api/<resource>`               | Create — body is the row     |
| PUT    | `/api/<resource>/:id`           | Update                       |
| DELETE | `/api/<resource>/:id`           | Delete                       |
| GET    | `/api/meta` · `PUT /api/meta`   | Household-wide settings      |
| POST   | `/api/snapshots`                | Freeze current month         |
| DELETE | `/api/snapshots/:label`         | Remove a snapshot            |

Resources: `income`, `expenses`, `savings`, `cc-utilization` (use
`?owner=kyle|visha`), `cc-expenses`.

Field names: API speaks **camelCase** (`dueDate`, `payPeriod`, `creditLimit`,
`contributionDays`); the DB stores **snake_case** (`due_date`, `pay_period`,
`credit_limit`, `contribution_days`). The translation happens in
[routes/api.js](routes/api.js).

Static assets are served with `Cache-Control: no-cache` so a browser
refresh always picks up the latest `app.js` / `style.css`.

## Database schema (SQLite, see `scripts/migrate.js`)

* **meta** — single row: `household_name`
* **income** — `id`, `item`, `amount`
* **expenses** — `id`, `item`, `due_date`, `amount`, `pay_period`, `paid_month` (`YYYY-MM` stamped when the row's "paid this month" checkbox is ticked; auto-clears on the 1st)
* **savings** — `id`, `item`, `contribution_days` (free text, e.g. `5/7, 5/22`), `amount`, `saved`, `goal` (legacy `date` column retained but unused)
* **cc_utilization** — `id`, `owner` (`kyle` | `visha`), `name`, `date`, `balance`, `credit_limit`
* **cc_expenses** — `id`, `card`, `item`, `due_date`, `amount`, `pay_period`
* **snapshots** — `label`, `captured_at`, `payload` (JSON: totals + frozen tables)

Migrations are idempotent (`CREATE TABLE IF NOT EXISTS` + `ALTER TABLE`
guarded by `pragma_table_info`) and run automatically on every server start.

### Auto-backup

`server.js` snapshots the live DB into `data/backups/app-YYYY-MM-DD-HHMM.db`
once on startup and once every 24 h thereafter, keeping the latest 30 files.
Uses SQLite's online-backup API so it's safe while the server is serving
requests. To restore, stop the service and copy a backup over `data/app.db`.

## Frontend

Single page (`public/index.html`) + hash router in `app.js`. Six views:

| Hash               | View                                                                |
| ------------------ | ------------------------------------------------------------------- |
| `#/dashboard`      | Summary stats, income-vs-expenses bar, % spent doughnut, upcoming bills, CC utilization |
| `#/income`         | Editable list of income sources                                     |
| `#/expenses`       | Editable list of bills with Excel-style filters + sort              |
| `#/savings`        | One row per account; goal tracking; per-account contribution days   |
| `#/credit-cards`   | Overall + per-card utilization, balances, recurring charges by card |
| `#/reports`        | Month-over-month trends and snapshot comparison                     |

Charts: [Chart.js](https://www.chartjs.org/) via CDN.

### Editable tables

Every inline edit writes to the API on the input's `change`, `blur`, **and**
Enter-key events — whichever fires first — so changes can't be lost by
clicking away. The cell briefly flashes green to confirm a save landed.
Duplicate saves are short-circuited if the value didn't actually change.

### Date handling

* **Auto-rolling display** — date columns flagged `autoRoll` always render in the
  current calendar month. IKEA's day-13 bill reads `May 13` for the whole month
  even after the 13th passes; only when June 1 arrives does it flip to `Jun 13`.
* The Dashboard's **Upcoming Bills (next 30 days)** card uses a separate roll
  rule that *skips past today*, since "next 30 days" means strictly future.
* All date parsing uses a `parseLocalDate` helper that treats `YYYY-MM-DD` as
  a local-time date — avoids the UTC-midnight off-by-one bug that otherwise
  shifts dates by a day in any negative-offset timezone.

### Expenses: Excel-style column filters + sort

* **▾** button next to each filterable header (Bill, Due Date, Amount, Pay Period)
* Popup: Sort A→Z / Z→A + a searchable checkbox list of unique values
* **Refresh order** button re-sorts the whole table ascending by day-of-month
* New rows auto-slot into the sorted position the moment their due date is saved
* Active filter columns show a blue ▾; the stat card shows a filtered subtotal
* Footer total always reflects all rows (global figure)
* **Paid this month** checkbox (left column) — stamps the current `YYYY-MM`
  into `paid_month`. Paid rows render dimmed + struck-through; the stat
  card shows "X of Y paid · $Z left". Checkbox auto-resets on the 1st of
  the next month since the stored month no longer matches the current one.

### Credit Cards page

* Top stat cards: Kyle utilization, Visha utilization, cards tracked (primary
  holders only, dedupes the V: auth-user copies), recurring CC charges
* **Utilization by Card** grid: every unique card with its own percentage,
  bar, and balance/limit — sorted highest utilization first
* Utilization Chart: deduplicated bar graph of balance vs limit
* Per-person card tables (Kyle / Visha) showing every card affecting that
  person's credit (V: cards appear in both, intentionally)
* Recurring Charges by Card: filterable by full card name (`K: Capital One
  Savor`, `V: Chase`, …), not generic issuer buckets
* All utilization values auto-update the moment a balance or limit is edited

#### Utilization color thresholds

Applied to both the per-card cells and the Kyle/Visha overall stat cards:

| Range          | Color  |
| -------------- | ------ |
| ≤ 6 %          | green  |
| 6 % – 30 %     | yellow |
| &gt; 30 %      | red    |

### Sidebar clock

Live time + date in **America/Chicago**, updates every 30 s. The timezone
abbreviation auto-switches between **CST** in winter and **CDT** in summer.

### Snapshots

Sidebar's **Save monthly snapshot** button freezes the current month's totals
+ table contents under a label (default: `YYYY-MM`). Snapshots power the
Reports page's trends and comparison table. Snapshot management
(list/delete) lives at the bottom of `#/reports`.
