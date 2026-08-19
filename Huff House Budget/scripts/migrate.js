// Create the SQLite schema. Safe to run repeatedly — every CREATE
// uses IF NOT EXISTS. Called automatically on server startup, and
// also exposed as `npm run migrate`.

const path     = require("path");
const Database = require("better-sqlite3");

const DEFAULT_DB = path.join(__dirname, "..", "data", "app.db");

function migrate(dbPath = DEFAULT_DB) {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    -- Single-row table for household-wide settings.
    CREATE TABLE IF NOT EXISTS meta (
      id              INTEGER PRIMARY KEY CHECK (id = 1),
      household_name  TEXT    NOT NULL DEFAULT 'My Household'
    );

    CREATE TABLE IF NOT EXISTS income (
      id      TEXT PRIMARY KEY,
      item    TEXT NOT NULL DEFAULT '',
      amount  REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id          TEXT PRIMARY KEY,
      item        TEXT NOT NULL DEFAULT '',
      due_date    TEXT,
      amount      REAL NOT NULL DEFAULT 0,
      pay_period  TEXT
    );

    CREATE TABLE IF NOT EXISTS savings (
      id                TEXT PRIMARY KEY,
      item              TEXT NOT NULL DEFAULT '',
      date              TEXT,
      amount            REAL NOT NULL DEFAULT 0,
      saved             REAL NOT NULL DEFAULT 0,
      goal              REAL NOT NULL DEFAULT 0,
      contribution_days TEXT NOT NULL DEFAULT ''
    );

    -- "owner" is either 'kyle' or 'visha'. limit is reserved in SQL,
    -- so the column is credit_limit and gets translated for the API.
    CREATE TABLE IF NOT EXISTS cc_utilization (
      id            TEXT PRIMARY KEY,
      owner         TEXT NOT NULL CHECK (owner IN ('kyle', 'visha')),
      name          TEXT NOT NULL DEFAULT '',
      date          TEXT,
      balance       REAL NOT NULL DEFAULT 0,
      credit_limit  REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS cc_expenses (
      id          TEXT PRIMARY KEY,
      card        TEXT NOT NULL DEFAULT '',
      item        TEXT NOT NULL DEFAULT '',
      due_date    TEXT,
      amount      REAL NOT NULL DEFAULT 0,
      pay_period  TEXT
    );

    -- Frozen monthly archives. payload is a JSON blob of totals + tables.
    CREATE TABLE IF NOT EXISTS snapshots (
      label        TEXT PRIMARY KEY,
      captured_at  TEXT NOT NULL,
      payload      TEXT NOT NULL
    );
  `);

  // Schema evolution: add new columns to pre-existing tables (SQLite has no
  // ALTER ... ADD IF NOT EXISTS, so probe pragma_table_info first).
  const ensureColumn = (table, col, ddl) => {
    const exists = db.prepare(
      `SELECT 1 FROM pragma_table_info(?) WHERE name = ?`
    ).get(table, col);
    if (!exists) db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  };
  ensureColumn("savings",  "contribution_days", `contribution_days TEXT NOT NULL DEFAULT ''`);
  // paid_month is "YYYY-MM" — bills with paid_month == current month render
  // as checked; the checkbox naturally auto-clears the first day of next month.
  ensureColumn("expenses", "paid_month",        `paid_month        TEXT NOT NULL DEFAULT ''`);

  // Ensure the singleton meta row exists.
  db.prepare(`INSERT OR IGNORE INTO meta (id, household_name) VALUES (1, 'Huff Household')`).run();

  db.close();
  return dbPath;
}

if (require.main === module) {
  const out = migrate();
  console.log("Migrated:", out);
}

module.exports = { migrate };
