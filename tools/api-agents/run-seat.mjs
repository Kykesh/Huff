#!/usr/bin/env node
/**
 * run-seat.mjs — run one Huff agent seat headless on the Claude Agent SDK, billed to the Console API key
 * (Kyle's Max-plan API credits, org "Sr's Individual Org"), never to the Claude subscription.
 *
 * Why it exists (Kyle, 2026-10-12): "if you can make agents that can use our api agents that would be helpful and
 * they can switch between usage and api credits since this will be monthly". Kyle, 2026-10-13 00:0x: "run our api's
 * until we hit the 150$ limit they are always to be used first" — so this runner is the FIRST lane for every agent
 * seat, and the subscription (IDE Agent tool, workflows) is the overflow once the agents' cycle cap is reached (or for a
 * job the API lane cannot run). The Max-plan credits cover the Claude API and the Claude Agent SDK, not
 * Claude Code sessions, which is why this is built on the Agent SDK and refuses to run unless the SDK reports
 * apiKeySource = ANTHROPIC_API_KEY.
 *
 * Safety: the seat runs in the SDK's `auto` permission mode — a classifier approves or denies every tool call — and
 * any call the classifier cannot decide is DENIED (headless, nobody to ask). Tools are limited to the charter's own
 * list; no subagents or workflows (they would bill the same credits outside the run's cap).
 *
 * Usage:
 *   node run-seat.mjs run --seat <name> (--brief <file> | --prompt "<text>") [--cwd <dir>] [--model opus|fable|<id>]
 *                         [--max-usd <n>] [--max-turns <n>] [--dry-run]
 *   node run-seat.mjs status
 *
 * Budget (USD, env-overridable): API_AGENTS_MONTHLY_USD (default 150, Kyle 10-12) per credit cycle (cycles start on the 2nd, the day
 * the monthly credit lands), API_AGENTS_DAILY_USD (default = the cycle cap: no separate daily brake, Kyle 10-13 "until we
 * hit the 150$ limit"), API_AGENTS_RUN_USD (10), and never into the reserve that keeps Gojo funded to the cycle end
 * (per trading day left: max($4, his peak day of the last 10)). The SDK gets
 * maxBudgetUsd = min(run cap, what is left today, what is left this cycle) and stops the run itself at that figure.
 * Gojo's own learning (chart reads, planner) draws on the same credits and comes first (CEO-114); the agent cap is the
 * share the agents may take.
 *
 * Model: API runs default to claude-opus-5-5 ($4/$20 per MTok). Fable 5.1 costs 2.5x on the API ($10/$50), so a Fable
 * seat runs on Opus here unless --model fable is passed. Effort comes from the seat's charter.
 *
 * The key is read from trading_personal/.env.local inside this process and handed only to the SDK's environment; it is
 * never printed, logged or written anywhere.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { query } from '@anthropic-ai/claude-agent-sdk';

const HUFF = '/Users/kylehuffsr./Documents/GitHub/Huff';
const TRADING = path.join(HUFF, 'Gojo', 'trading_personal');
const AGENTS_DIR = path.join(HUFF, '.claude', 'agents');
const ENV_FILE = path.join(TRADING, '.env.local');
const PROD_DB = path.join(HUFF, 'Gojo', 'gojo_prod', 'data', 'trading.db');
const LEDGER = path.join(os.homedir(), '.local', 'gojo-integrator', 'api-agents-ledger.jsonl');
const RUNS_DIR = fs.existsSync('/Volumes/GojoData/gojo') ? '/Volumes/GojoData/gojo/api-agents/runs'
  : path.join(os.homedir(), '.local', 'gojo-integrator', 'api-agents-runs');

const CONFIG_DIR = path.join(os.homedir(), '.local', 'gojo-integrator', 'api-agents-claude-config');
const MODEL_IDS = { opus: 'claude-opus-5-5', fable: 'claude-fable-5-1', sonnet: 'claude-sonnet-5-5' };
const DEFAULT_API_MODEL = MODEL_IDS.opus;
const KNOWN_TOOLS = new Set(['Bash', 'Read', 'Write', 'Edit', 'Grep', 'Glob', 'WebSearch', 'WebFetch', 'NotebookEdit']);
const num = (v, d) => (v !== undefined && v !== '' && Number.isFinite(Number(v)) ? Number(v) : d);
// Kyle, 2026-10-12 21:2x: "no until gojo is trading better than me make the api cap 150$ and get those api agents to work now".
const CAPS = {
  monthly: num(process.env.API_AGENTS_MONTHLY_USD, 150),
  // Kyle 10-13 00:0x: "run our api's until we hit the 150$ limit" — no separate daily brake by default.
  daily: num(process.env.API_AGENTS_DAILY_USD, num(process.env.API_AGENTS_MONTHLY_USD, 150)),
  run: num(process.env.API_AGENTS_RUN_USD, 10),
};
// The credits are shared with Gojo's own learning (CEO-114: Gojo first). The agents never spend into the reserve that keeps
// Gojo funded to the end of the cycle: per trading day left, max($4 — the merged vision USD cap — and his peak day of
// the last 10), read from prod's anthropic_usage once the CEO-114 ledger is there (F-1081).
const CREDITS = { monthly: num(process.env.API_CREDITS_USD, 200), gojoPerTradingDay: num(process.env.API_GOJO_RESERVE_PER_TRADING_DAY, 4) };
const MIN_RUN_USD = 0.5;

function die(msg, code = 2) { console.error(`run-seat: ${msg}`); process.exit(code); }

function args(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { const k = a.slice(2); if (k === 'dry-run') out[k] = true; else out[k] = argv[++i]; } else out._.push(a);
  }
  return out;
}

/** The charter's frontmatter fields we use, and its body (the seat's instructions). */
export function readCharter(seat) {
  if (!/^[a-z][a-z0-9-]*$/.test(seat || '')) die(`--seat "${seat}" is not a seat name`);
  const file = path.join(AGENTS_DIR, `${seat}.md`);
  if (!fs.existsSync(file)) die(`no charter at ${file}`);
  const txt = fs.readFileSync(file, 'utf8');
  const m = /^---\n([\s\S]*?)\n---\n/.exec(txt);
  if (!m) die(`${file} has no frontmatter`);
  const fm = {};
  for (const line of m[1].split('\n')) { const kv = /^(\w+):\s*(.*)$/.exec(line); if (kv) fm[kv[1]] = kv[2].trim(); }
  return { file, fm, body: txt.slice(m[0].length), sha256: crypto.createHash('sha256').update(txt).digest('hex') };
}

function apiKey() {
  let env;
  try { env = fs.readFileSync(ENV_FILE, 'utf8'); } catch { die(`cannot read ${ENV_FILE}`); }
  const m = /^ANTHROPIC_API_KEY=(.*)$/m.exec(env);
  if (!m) die(`no ANTHROPIC_API_KEY line in ${ENV_FILE}`);
  const key = m[1].trim().replace(/^["']|["']$/g, '');
  if (!key.startsWith('sk-ant-')) die('ANTHROPIC_API_KEY in .env.local does not look like a Console API key');
  return key;
}

/** The credit cycle starts on the 2nd (the monthly credit lands then); local time. */
export function cycleStart(now = new Date()) {
  const s = new Date(now.getFullYear(), now.getMonth(), 2, 0, 0, 0, 0);
  if (now < s) s.setMonth(s.getMonth() - 1);
  return s;
}
/** Trading days (Mon–Fri) from tomorrow to the next cycle start — what Gojo's reads still need. F-1081: the per-day
 *  reserve is the larger of the floor ($4, the vision cap) and Gojo's highest measured day of the last 10, so a Gojo
 *  that spends more (Fable planning switched on) grows his own reserve instead of being squeezed by the agents. */
export function gojoReserve(now = new Date(), perDay = CREDITS.gojoPerTradingDay) {
  const end = cycleStart(now); end.setMonth(end.getMonth() + 1);
  let d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); let n = 0;
  for (; d < end; d.setDate(d.getDate() + 1)) if (d.getDay() !== 0 && d.getDay() !== 6) n++;
  return n * Math.max(CREDITS.gojoPerTradingDay, perDay || 0);
}
function dayStart(now = new Date()) { return new Date(now.getFullYear(), now.getMonth(), now.getDate()); }

function ledgerRows() {
  try {
    return fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    return die(`ledger unreadable (${e.message}) — refusing to spend without knowing what was spent`);
  }
}
export function spent(rows, since) { return rows.filter((r) => new Date(r.ts) >= since).reduce((s, r) => s + (Number(r.cost_usd) || 0), 0); }

const sq = (sql) => execFileSync('/usr/bin/sqlite3', ['-readonly', PROD_DB, sql], { encoding: 'utf8', timeout: 10_000 }).trim();
const utc = (d) => d.toISOString().replace('T', ' ').slice(0, 19);

/** Everything Gojo has spent on the API since `since`, read-only from prod (F-1081). Once the CEO-114 ledger
 *  (`anthropic_usage`, every surface) exists it is the total; chart_vision_reads covers only the time before its first
 *  row. `peakDay` is his highest day of the last 10 — it sizes the reserve. null = unreadable (callers refuse). */
function gojoSpend(since, now = new Date()) {
  try {
    const hasLedger = sq(`select count(*) from sqlite_master where type='table' and name='anthropic_usage';`) === '1';
    const first = hasLedger ? sq(`select coalesce(min(created_at),'') from anthropic_usage;`) : '';
    const visionUntil = first ? ` and created_at < '${first}'` : '';
    const [vUsd, vN] = sq(`select coalesce(round(sum(cost_usd),4),0), count(*) from chart_vision_reads where created_at >= '${utc(since)}'${visionUntil};`).split('|');
    let lUsd = 0, lN = 0;
    if (first) [lUsd, lN] = sq(`select coalesce(round(sum(usd_est),4),0), count(*) from anthropic_usage where created_at >= '${utc(since)}' and status <> 'refused';`).split('|');
    const tenAgo = utc(new Date(now.getTime() - 10 * 86_400_000));
    const days = sq(`select d, sum(u) from (select date(created_at) d, cost_usd u from chart_vision_reads where created_at >= '${tenAgo}'${visionUntil}`
      + (first ? ` union all select date(created_at), usd_est from anthropic_usage where created_at >= '${tenAgo}' and status <> 'refused'` : '')
      + `) group by d;`).split('\n').filter(Boolean).map((l) => Number(l.split('|')[1]) || 0);
    return { usd: Number(vUsd) + Number(lUsd), calls: Number(vN) + Number(lN), ledger: Boolean(first), peakDay: days.length ? Math.max(...days) : 0 };
  } catch { return null; }
}

function status() {
  const rows = ledgerRows();
  const now = new Date(); const cs = cycleStart(now); const ds = dayStart(now);
  const cyc = spent(rows, cs); const day = spent(rows, ds);
  const gojo = gojoSpend(cs, now);
  console.log(`credit cycle since ${cs.toDateString()} (credits land on the 2nd)`);
  console.log(`  agents on API:    $${cyc.toFixed(2)} of $${CAPS.monthly} this cycle · $${day.toFixed(2)} of $${CAPS.daily} today · ${rows.filter((r) => new Date(r.ts) >= cs).length} runs`);
  console.log(gojo ? `  Gojo on API:      $${gojo.usd.toFixed(2)} (${gojo.calls} calls; ${gojo.ledger ? 'every surface, from anthropic_usage' : 'chart reads only — the CEO-114 ledger is not on prod yet'}) — prod, read-only`
    : '  Gojo on API:      prod DB unreadable — every run refuses until it reads');
  console.log(`  reserve kept for Gojo to the cycle end: $${gojoReserve(now, gojo?.peakDay).toFixed(2)} (per trading day: max($${CREDITS.gojoPerTradingDay}, his peak day of the last 10 = $${(gojo?.peakDay ?? 0).toFixed(2)}))`);
}

async function run(a) {
  const ch = readCharter(a.seat);
  let prompt = a.prompt;
  if (a.brief) { try { prompt = fs.readFileSync(a.brief, 'utf8'); } catch { die(`cannot read --brief ${a.brief}`); } }
  if (!prompt || !prompt.trim()) die('give the job with --brief <file> or --prompt "<text>"');
  const model = a.model ? (MODEL_IDS[a.model] || a.model) : DEFAULT_API_MODEL;
  if (!/^claude-[a-z0-9-]+$/.test(model)) die(`--model "${a.model}" is not a model id or alias`);
  const effort = ['low', 'medium', 'high', 'xhigh', 'max'].includes(ch.fm.effort) ? ch.fm.effort : 'high';
  const tools = (ch.fm.tools || 'Read, Grep, Glob').split(',').map((t) => t.trim()).filter((t) => KNOWN_TOOLS.has(t));
  const cwd = path.resolve(a.cwd || TRADING);
  if (!fs.existsSync(cwd)) die(`--cwd ${cwd} does not exist`);

  const rows = ledgerRows(); const now = new Date();
  const leftCycle = CAPS.monthly - spent(rows, cycleStart(now));
  const leftDay = CAPS.daily - spent(rows, dayStart(now));
  const gojo = gojoSpend(cycleStart(now), now);
  const leftCredits = CREDITS.monthly - spent(rows, cycleStart(now)) - (gojo ? gojo.usd : CREDITS.monthly) - gojoReserve(now, gojo?.peakDay);
  const runCap = Math.min(num(a['max-usd'], CAPS.run), CAPS.run, leftCycle, leftDay, leftCredits);
  const plan = { seat: a.seat, model, effort, tools, cwd, max_usd: Number(runCap.toFixed(2)), left_cycle: Number(leftCycle.toFixed(2)), left_day: Number(leftDay.toFixed(2)), left_credits_after_gojo_reserve: Number(leftCredits.toFixed(2)), charter_sha256: ch.sha256.slice(0, 12) };
  if (runCap < MIN_RUN_USD) die(`budget refuses the run: ${JSON.stringify(plan)}`, 3);
  if (a['dry-run']) { console.log(JSON.stringify({ dryRun: true, ...plan })); return; }

  // Two things make the Console key the ONLY credential the SDK's Claude Code can see (measured 2026-10-12, apiKeySource "none"
  // until both were in place): a dedicated config dir (otherwise it finds Kyle's subscription login in the keychain), and a
  // clean allowlisted environment (variables inherited from a parent Claude Code session make the child ignore the key).
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  const env = Object.fromEntries(['PATH', 'HOME', 'USER', 'LOGNAME', 'SHELL', 'LANG', 'LC_ALL', 'TMPDIR', 'TERM']
    .filter((k) => process.env[k] !== undefined).map((k) => [k, process.env[k]]));
  Object.assign(env, { ANTHROPIC_API_KEY: apiKey(), CLAUDE_CONFIG_DIR: CONFIG_DIR, CLAUDE_AGENT_SDK_CLIENT_APP: 'gojo-api-agents/1.0' });

  fs.mkdirSync(RUNS_DIR, { recursive: true }); fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  // pid in the name: two runs of one seat launched in the same millisecond must not share a transcript (seen 2026-10-13).
  const transcript = path.join(RUNS_DIR, `${now.toISOString().replace(/[:.]/g, '-')}-${a.seat}-${process.pid}.jsonl`);
  const tout = fs.createWriteStream(transcript, { flags: 'a' });
  const abort = new AbortController();
  const appendix = `\n\n# You are running as the ${a.seat} seat on the API-credit lane (Huff/tools/api-agents/run-seat.mjs).\n`
    + `The run is capped at $${plan.max_usd} of Kyle's API credits and stops when that is spent, so commit and push every verified step as soon as it is green. `
    + 'Tool calls are vetted by the auto-mode classifier; a call it cannot clear is denied — take the safer route and continue.\n\n'
    + ch.body;

  let result = null; let source = null; let refusedAuth = false;
  try {
    for await (const msg of query({
      prompt,
      options: {
        cwd, model, effort, env, abortController: abort,
        maxBudgetUsd: plan.max_usd,
        maxTurns: Math.max(1, Math.floor(num(a['max-turns'], 200))),
        fallbackModel: model === MODEL_IDS.fable ? MODEL_IDS.opus : undefined,
        systemPrompt: { type: 'preset', preset: 'claude_code', append: appendix },
        settingSources: ['project'],
        tools, permissionMode: 'auto',
        canUseTool: async (toolName) => ({ behavior: 'deny', message: `headless API lane: the auto-mode classifier could not clear ${toolName}, and nobody is here to approve it — take a safer route` }),
        disallowedTools: ['Agent', 'Task', 'Workflow'],
      },
    })) {
      tout.write(`${JSON.stringify(msg)}\n`);
      if (msg.type === 'system' && msg.subtype === 'init') {
        source = msg.apiKeySource;
        if (source !== 'ANTHROPIC_API_KEY') { refusedAuth = true; abort.abort(); break; }
      }
      if (msg.type === 'result') result = msg;
    }
  } catch (e) {
    if (!refusedAuth) console.error(`run-seat: SDK error — ${e.message}`);
  } finally { tout.end(); }

  const row = {
    ts: new Date().toISOString(), seat: a.seat, model, effort, cwd,
    subtype: refusedAuth ? 'refused-not-api-key' : (result?.subtype ?? 'no-result'),
    cost_usd: Number(result?.total_cost_usd ?? 0), turns: result?.num_turns ?? null, session_id: result?.session_id ?? null,
    api_key_source: source, max_usd: plan.max_usd, charter_sha256: plan.charter_sha256,
    prompt_sha256: crypto.createHash('sha256').update(prompt).digest('hex').slice(0, 12), transcript,
  };
  fs.appendFileSync(LEDGER, `${JSON.stringify(row)}\n`);
  if (refusedAuth) die(`refused: the SDK authenticated with "${source}", not the Console API key — nothing was billed to the credits`, 4);
  if (result?.subtype === 'success') console.log(result.result);
  console.error(`run-seat: ${a.seat} ${row.subtype} · $${row.cost_usd.toFixed(4)} · ${row.turns} turns · ${model} @ ${effort} · transcript ${transcript}`);
  process.exit(result?.subtype === 'success' ? 0 : 1);
}

const a = args(process.argv.slice(2));
const cmd = a._[0];
if (cmd === 'status') status();
else if (cmd === 'run') await run(a);
else die('usage: run-seat.mjs run --seat <name> (--brief <file> | --prompt "<text>") [--cwd <dir>] [--model opus|fable|<id>] [--max-usd <n>] [--max-turns <n>] [--dry-run]\n       run-seat.mjs status');
