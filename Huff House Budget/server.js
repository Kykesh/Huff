// Express entry point.
//   - Auto-runs migrations so the DB is always ready
//   - Serves the SPA from /public
//   - Mounts the JSON API at /api
//
// Run with:   npm start         (production-ish)
//             npm run dev       (auto-reload via node --watch)

const fs      = require("fs");
const path    = require("path");
const express = require("express");
const Database = require("better-sqlite3");

const { migrate } = require("./scripts/migrate");
const apiRouter   = require("./routes/api");

const PORT       = Number(process.env.PORT) || 3001;
const DB_PATH    = path.join(__dirname, "data", "app.db");
const PUBLIC     = path.join(__dirname, "public");
const BACKUP_DIR = path.join(__dirname, "data", "backups");
const KEEP_BACKUPS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

// 1) Make sure tables exist before any request can hit the DB.
migrate(DB_PATH);

// 1b) Auto-backup the DB once per day. Cheap insurance against a bad
//     `seed --force` or accidental delete. SQLite's online-backup API
//     is safe to run while the server is serving requests.
function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith("app-") && f.endsWith(".db"))
    .map((f) => ({ f, t: fs.statSync(path.join(BACKUP_DIR, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
}
function pruneOldBackups() {
  for (const { f } of listBackups().slice(KEEP_BACKUPS)) {
    fs.unlinkSync(path.join(BACKUP_DIR, f));
  }
}
async function backupNow() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[T:]/g, "-").slice(0, 16);
  const dest = path.join(BACKUP_DIR, `app-${stamp}.db`);
  const src = new Database(DB_PATH, { readonly: true });
  try {
    await src.backup(dest);
    pruneOldBackups();
    console.log(`[backup] wrote ${path.basename(dest)} (${listBackups().length} kept)`);
  } catch (err) {
    console.error("[backup] failed:", err.message);
  } finally {
    src.close();
  }
}
function backupIfDue() {
  const all = listBackups();
  if (!all.length || Date.now() - all[0].t >= DAY_MS) backupNow();
}
backupIfDue();
setInterval(backupIfDue, DAY_MS);

const app = express();

// 2) Parse JSON bodies for POST/PUT.
app.use(express.json({ limit: "1mb" }));

// 3) Mount the API. Anything not under /api falls through to static files.
app.use("/api", apiRouter);

// 4) Serve the single-page frontend. no-cache so browser refresh always
//    picks up fresh app.js / style.css after code changes.
app.use(express.static(PUBLIC, {
  setHeaders: (res) => res.setHeader("Cache-Control", "no-cache"),
}));

// 5) SPA fallback — any unknown non-API GET returns index.html so the
//    hash router can take over on the client.
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(PUBLIC, "index.html"));
});

app.listen(PORT, () => {
  const stamp = new Date().toISOString();
  console.log(`[huff-budget ${stamp}] db   ${DB_PATH}`);
  console.log(`[huff-budget ${stamp}] open http://localhost:${PORT}/`);
});
