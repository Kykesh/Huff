// JSON API. Each table gets the same four endpoints:
//   GET    /api/<resource>          list
//   POST   /api/<resource>          create
//   PUT    /api/<resource>/:id      update
//   DELETE /api/<resource>/:id      delete
//
// Plus two extras:
//   GET    /api/all                 full state in one shot (used at startup)
//   POST   /api/snapshots           freeze the current month
//   DELETE /api/snapshots/:label    drop a snapshot
//
// DB columns are snake_case; the API speaks camelCase (matches JS convention).
// The two helpers below translate at the boundary.

const path     = require("path");
const express  = require("express");
const Database = require("better-sqlite3");

const db = new Database(path.join(__dirname, "..", "data", "app.db"));
db.pragma("journal_mode = WAL");

const router = express.Router();

// ---------- name translation ----------
const toCamel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const toSnake = (s) => s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
const camelRow = (row) => row && Object.fromEntries(Object.entries(row).map(([k, v]) => [toCamel(k), v]));
const snakeRow = (row) => row && Object.fromEntries(Object.entries(row).map(([k, v]) => [toSnake(k), v]));

// ---------- one resource = one table with the same CRUD pattern ----------
const RESOURCES = {
  income:           { table: "income",         cols: ["item", "amount"],                                  idPrefix: "inc" },
  expenses:         { table: "expenses",       cols: ["item", "due_date", "amount", "pay_period", "paid_month"], idPrefix: "exp" },
  savings:          { table: "savings",        cols: ["item", "contribution_days", "amount", "saved", "goal"], idPrefix: "sav" },
  "cc-utilization": { table: "cc_utilization", cols: ["owner", "name", "date", "balance", "credit_limit"],idPrefix: "ccu" },
  "cc-expenses":    { table: "cc_expenses",    cols: ["card", "item", "due_date", "amount", "pay_period"],idPrefix: "cce" },
};

for (const [route, { table, cols, idPrefix }] of Object.entries(RESOURCES)) {
  // LIST  (optional ?owner= filter for cc-utilization)
  router.get(`/${route}`, (req, res) => {
    let sql = `SELECT * FROM ${table}`, params = [];
    if (req.query.owner && cols.includes("owner")) {
      sql += ` WHERE owner = ?`;
      params.push(req.query.owner);
    }
    res.json(db.prepare(sql).all(...params).map(camelRow));
  });

  // CREATE
  router.post(`/${route}`, (req, res) => {
    const body = snakeRow(req.body || {});
    const id   = body.id || `${idPrefix}-${Date.now()}`;
    const values = cols.map((c) => body[c] ?? defaultFor(c));
    const sql = `INSERT INTO ${table} (id, ${cols.join(", ")})
                 VALUES (?, ${cols.map(() => "?").join(", ")})`;
    db.prepare(sql).run(id, ...values);
    res.status(201).json(camelRow(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id)));
  });

  // UPDATE
  router.put(`/${route}/:id`, (req, res) => {
    const body = snakeRow(req.body || {});
    const values = cols.map((c) => body[c] ?? defaultFor(c));
    const sql = `UPDATE ${table} SET ${cols.map((c) => `${c} = ?`).join(", ")} WHERE id = ?`;
    const info = db.prepare(sql).run(...values, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "not found" });
    res.json(camelRow(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id)));
  });

  // DELETE
  router.delete(`/${route}/:id`, (req, res) => {
    const info = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "not found" });
    res.json({ ok: true });
  });
}

function defaultFor(col) {
  if (["amount", "balance", "credit_limit", "saved", "goal"].includes(col)) return 0;
  return "";
}

// ---------- meta (single-row settings) ----------
router.get("/meta", (req, res) => {
  res.json(camelRow(db.prepare(`SELECT * FROM meta WHERE id = 1`).get()) || {});
});
router.put("/meta", (req, res) => {
  const body = snakeRow(req.body || {});
  db.prepare(`UPDATE meta SET household_name = ? WHERE id = 1`).run(body.household_name || "Household");
  res.json(camelRow(db.prepare(`SELECT * FROM meta WHERE id = 1`).get()));
});

// ---------- snapshots ----------
router.get("/snapshots", (req, res) => {
  const rows = db.prepare(`SELECT label, captured_at, payload FROM snapshots ORDER BY label`).all();
  res.json(rows.map((r) => ({ label: r.label, capturedAt: r.captured_at, ...JSON.parse(r.payload) })));
});

router.post("/snapshots", (req, res) => {
  const label = (req.body && req.body.label) || new Date().toISOString().slice(0, 7);
  const payload = buildSnapshotPayload();
  db.prepare(
    `INSERT OR REPLACE INTO snapshots (label, captured_at, payload) VALUES (?, ?, ?)`
  ).run(label, new Date().toISOString(), JSON.stringify(payload));
  res.status(201).json({ label, capturedAt: new Date().toISOString(), ...payload });
});

router.delete("/snapshots/:label", (req, res) => {
  const info = db.prepare(`DELETE FROM snapshots WHERE label = ?`).run(req.params.label);
  if (info.changes === 0) return res.status(404).json({ error: "not found" });
  res.json({ ok: true });
});

// ---------- /api/all : full state in one fetch ----------
router.get("/all", (req, res) => {
  res.json(loadFullState());
});

// ---------- helpers shared by /all and snapshots ----------
function loadFullState() {
  const all = (sql, ...args) => db.prepare(sql).all(...args).map(camelRow);
  const meta = camelRow(db.prepare(`SELECT * FROM meta WHERE id = 1`).get()) || { householdName: "Household" };
  return {
    meta,
    income:     all(`SELECT * FROM income`),
    expenses:   all(`SELECT * FROM expenses`),
    savings:    all(`SELECT * FROM savings`),
    ccUtilization: {
      kyle:  all(`SELECT * FROM cc_utilization WHERE owner = ?`, "kyle"),
      visha: all(`SELECT * FROM cc_utilization WHERE owner = ?`, "visha"),
    },
    ccExpenses: all(`SELECT * FROM cc_expenses`),
    snapshots:  db.prepare(`SELECT label, captured_at, payload FROM snapshots ORDER BY label`).all()
                  .map((r) => ({ label: r.label, capturedAt: r.captured_at, ...JSON.parse(r.payload) })),
  };
}

function buildSnapshotPayload() {
  const s = loadFullState();
  const sum = (rows, k) => rows.reduce((acc, r) => acc + (Number(r[k]) || 0), 0);
  const totals = {
    income:      sum(s.income, "amount"),
    expenses:    sum(s.expenses, "amount"),
    savings:     sum(s.savings, "amount"),
    ccExpenses:  sum(s.ccExpenses, "amount"),
  };
  totals.cashBalance = totals.income - totals.expenses - totals.savings;
  return {
    totals,
    income:        s.income,
    expenses:      s.expenses,
    savings:       s.savings,
    ccUtilization: s.ccUtilization,
    ccExpenses:    s.ccExpenses,
  };
}

module.exports = router;
