#!/usr/bin/env node
/**
 * run-seat.mjs — run one Huff agent seat headless on the Claude Agent SDK, billed to the Console API key
 * (Kyle's Max-plan API credits, org "Sr's Individual Org"), never to the Claude subscription.
 *
 * Why it exists (Kyle, 2026-10-12): "if you can make agents that can use our api agents that would be helpful and
 * they can switch between usage and api credits since this will be monthly". The subscription seats (IDE Agent tool)
 * stop when a 5-hour window, the weekly limit or the Fable credits run out; this runner is the overflow lane that keeps
 * a seat working on the API credits instead. The Max-plan credits cover the Claude API and the Claude Agent SDK, not
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
 * Budget (USD, env-overridable): API_AGENTS_MONTHLY_USD (default 50) per credit cycle (cycles start on the 2nd, the day
 * the monthly credit lands), API_AGENTS_DAILY_USD (15), API_AGENTS_RUN_USD (6). The SDK gets
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
const CAPS = {
  monthly: num(process.env.API_AGENTS_MONTHLY_USD, 50),
  daily: num(process.env.API_AGENTS_DAILY_USD, 15),
  run: num(process.env.API_AGENTS_RUN_USD, 6),
};
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

function gojoVisionSpend(since) {
  try {
    const out = execFileSync('/usr/bin/sqlite3', ['-readonly', PROD_DB,
      `select coalesce(round(sum(cost_usd),4),0), count(*) from chart_vision_reads where created_at >= '${since.toISOString().replace('T', ' ').slice(0, 19)}';`],
    { encoding: 'utf8', timeout: 10_000 }).trim();
    const [usd, n] = out.split('|');
    return { usd: Number(usd), reads: Number(n) };
  } catch { return null; }
}

function status() {
  const rows = ledgerRows();
  const now = new Date(); const cs = cycleStart(now); const ds = dayStart(now);
  const cyc = spent(rows, cs); const day = spent(rows, ds);
  const gojo = gojoVisionSpend(cs);
  console.log(`credit cycle since ${cs.toDateString()} (credits land on the 2nd)`);
  console.log(`  agents on API:    $${cyc.toFixed(2)} of $${CAPS.monthly} this cycle · $${day.toFixed(2)} of $${CAPS.daily} today · ${rows.filter((r) => new Date(r.ts) >= cs).length} runs`);
  console.log(gojo ? `  Gojo chart reads: $${gojo.usd.toFixed(2)} (${gojo.reads} reads) — prod, read-only` : '  Gojo chart reads: prod DB unreadable');
  console.log('  Gojo planner:     not ledgered on prod until the CEO-114 spend guard is promoted');
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
  const runCap = Math.min(num(a['max-usd'], CAPS.run), CAPS.run, leftCycle, leftDay);
  const plan = { seat: a.seat, model, effort, tools, cwd, max_usd: Number(runCap.toFixed(2)), left_cycle: Number(leftCycle.toFixed(2)), left_day: Number(leftDay.toFixed(2)), charter_sha256: ch.sha256.slice(0, 12) };
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
  const transcript = path.join(RUNS_DIR, `${now.toISOString().replace(/[:.]/g, '-')}-${a.seat}.jsonl`);
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
