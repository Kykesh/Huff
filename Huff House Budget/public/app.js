/* Huff Budget — single-page app.
 *
 * Loads all data from /api/all once at startup, caches it in `state`,
 * and renders one of six views into <main id="main"> based on the URL hash.
 * Every edit goes straight to the API (POST/PUT/DELETE) and then re-fetches.
 */

(() => {
  "use strict";

  // ============================================================
  // 1. API helpers
  // ============================================================
  const API = "/api";
  const json = (method, body) => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const get  = (p)      => fetch(`${API}${p}`).then(r => r.json());
  const post = (p, b)   => fetch(`${API}${p}`, json("POST", b)).then(r => r.json());
  const put  = (p, b)   => fetch(`${API}${p}`, json("PUT",  b)).then(r => r.json());
  const del  = (p)      => fetch(`${API}${p}`, { method: "DELETE" }).then(r => r.json());

  // In-memory cache of server state. Refreshed by `reload()`.
  let state = {
    meta: { householdName: "" },
    income: [], expenses: [], savings: [],
    ccUtilization: { kyle: [], visha: [] },
    ccExpenses: [], snapshots: [],
  };

  async function reload() {
    state = await get("/all");
  }

  // ============================================================
  // 2. Formatters & calculations
  // ============================================================
  const fmtMoney = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n) || 0);
  const fmtPct   = (p, d = 1) => `${((Number(p) || 0) * 100).toFixed(d)}%`;
  // Parse a YYYY-MM-DD string as a local-time Date so getDate() returns the
  // intended day. `new Date("2025-05-22")` treats the string as UTC midnight,
  // which becomes May 21 in any negative-offset timezone — that off-by-one
  // bug is what made stored dates appear to "shift back" after saving.
  const parseLocalDate = (s) => {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const fmtDate  = (d) => {
    if (!d) return "—";
    const parsed = (d instanceof Date) ? d : parseLocalDate(d);
    if (!parsed) return String(d);
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Recurring bills repeat monthly on the same day-of-month. Display them
  // in the CURRENT calendar month (don't roll past when the day has already
  // happened) — IKEA due May 13 still reads "May 13" until June 1 arrives.
  // The Dashboard's "Upcoming Bills" card has its own rolling logic for
  // strictly-future bills.
  // "YYYY-MM" for the current local month — used by the "paid this month"
  // checkbox so it auto-resets on the 1st of the next month.
  const currentYearMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  function currentMonthDate(stored) {
    if (!stored) return "";
    const d = parseLocalDate(stored);
    if (!d) return stored;
    const day = d.getDate();
    const today = new Date();
    const out = new Date(today.getFullYear(), today.getMonth(), day);
    const pad = (n) => String(n).padStart(2, "0");
    return `${out.getFullYear()}-${pad(out.getMonth() + 1)}-${pad(out.getDate())}`;
  }
  const esc = (s) => (s ?? "").toString().replace(/[<>&]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;" }[c]));
  const attr = (s) => esc(s).replace(/"/g, "&quot;");
  const sumOf = (rows, key) => rows.reduce((s, r) => s + (Number(r[key]) || 0), 0);

  const calc = {
    income:      () => sumOf(state.income,    "amount"),
    expenses:    () => sumOf(state.expenses,  "amount"),
    savings:     () => sumOf(state.savings,   "amount"),
    ccExpenses:  () => sumOf(state.ccExpenses,"amount"),
    cashBalance: () => calc.income() - calc.expenses() - calc.savings(),
    percentSpent: () => {
      const i = calc.income();
      return i ? (calc.expenses() + calc.savings()) / i : 0;
    },
    cardUtil: (cards) => {
      const bal = sumOf(cards, "balance");
      const lim = sumOf(cards, "creditLimit");
      return { bal, lim, pct: lim > 0 ? bal / lim : 0 };
    },
    goalProgress: () => {
      const goal  = sumOf(state.savings, "goal");
      const saved = sumOf(state.savings, "saved");
      return { goal, saved, pct: goal > 0 ? saved / goal : 0 };
    },
  };

  // ============================================================
  // 3. UI helpers (toast, tag pill, prompt wrapper)
  // ============================================================
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }
  function tagFor(name) {
    if (/^K[:\s]/.test(name)) return `<span class="tag k">K</span>`;
    if (/^V[:\s]/.test(name)) return `<span class="tag v">V</span>`;
    return "";
  }

  // ============================================================
  // 4. Chart.js — register plugin for the doughnut center label
  // ============================================================
  if (typeof Chart !== "undefined") {
    Chart.register({
      id: "centerText",
      afterDraw(chart) {
        const opt = chart.config.options.plugins.centerText;
        if (!opt || !opt.text) return;
        const { ctx, chartArea: { left, right, top, bottom } } = chart;
        const cx = (left + right) / 2;
        const cy = (top + bottom) / 2;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#e8ebf2";
        ctx.font = `bold ${opt.size || 40}px ${getComputedStyle(document.body).fontFamily}`;
        ctx.fillText(opt.text, cx, cy - 6);
        if (opt.sub) {
          ctx.font = `500 12px ${getComputedStyle(document.body).fontFamily}`;
          ctx.fillStyle = "#98a1b3";
          ctx.fillText(opt.sub, cx, cy + 22);
        }
        ctx.restore();
      },
    });
  }
  const chartAxisOpts = ({ moneyY = false, hideLegend = false } = {}) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend:  { display: !hideLegend, labels: { color: "#98a1b3" } },
      tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label || ctx.label}: ${fmtMoney(ctx.raw)}` } },
    },
    scales: {
      x: { ticks: { color: "#98a1b3" }, grid: { color: "rgba(255,255,255,.04)" } },
      y: {
        beginAtZero: true,
        ticks: { color: "#98a1b3", callback: v => moneyY ? "$" + new Intl.NumberFormat().format(v) : v },
        grid:  { color: "rgba(255,255,255,.04)" },
      },
    },
  });

  // ============================================================
  // 5. Editable table — inline editing, autosaves to API
  // ============================================================
  let tblCounter = 0;
  function editableTable({ mount, resource, rows, columns, totalsKeys, newRow, addLabel = "+ Add row", extraNewFields = {} }) {
    const id = `etbl-${++tblCounter}`;

    const render = () => {
      mount.innerHTML = `
        <div class="scroll-x"><table class="bdg" id="${id}">
          <thead><tr>${columns.map(c =>
            `<th class="${c.align === 'right' ? 'num' : ''}" ${c.width ? `style="width:${c.width}"` : ""}>${c.label}${c.filterable ? ` <button class="col-filter-btn" data-col="${c.key}" title="Sort &amp; filter">&#9662;</button>` : ""}</th>`
          ).join("")}<th style="width:48px"></th></tr></thead>
          <tbody>${
            rows.length
              ? rows.map((r, i) => renderRow(r, i)).join("")
              : `<tr><td colspan="${columns.length + 1}" class="empty">No rows yet — click "${addLabel}".</td></tr>`
          }</tbody>
          ${totalsKeys ? `<tfoot id="${id}-foot">${footerCells()}</tfoot>` : ""}
        </table></div>
        <div class="btn-row" style="margin-top:12px;"><button class="btn" id="${id}-add">${addLabel}</button></div>
      `;
      bind();
    };

    function renderRow(r, i) {
      return `<tr data-row="${i}">${columns.map(c => {
        const val = r[c.key] ?? "";
        if (c.type === "select") {
          return `<td><select data-key="${c.key}" data-type="select">
            ${c.options.map(o => `<option value="${attr(o)}" ${o === val ? "selected" : ""}>${esc(o)}</option>`).join("")}
          </select></td>`;
        }
        if (c.type === "number") return `<td class="num"><input type="number" step="0.01" class="num" data-key="${c.key}" data-type="number" value="${val}"></td>`;
        if (c.type === "date") {
          // autoRoll columns: snap the displayed date to the current month
          // (preserving the day-of-month) so old stored dates stay current.
          const shown = c.autoRoll ? currentMonthDate(val) : (val || "");
          return `<td><input type="date" data-key="${c.key}" data-type="date" value="${shown}"></td>`;
        }
        if (c.type === "paid-toggle") {
          // val holds "YYYY-MM"; checked when it matches the current month,
          // so the checkbox naturally clears on the 1st of next month.
          const isPaid = val === currentYearMonth();
          return `<td class="paid-cell"><input type="checkbox" class="paid-toggle" data-key="${c.key}" data-type="paid-toggle"${isPaid ? " checked" : ""}></td>`;
        }
        return `<td><input type="text" data-key="${c.key}" data-type="text" value="${attr(val)}"></td>`;
      }).join("")}<td><button class="btn icon danger" data-del title="Delete">×</button></td></tr>`;
    }

    function footerCells() {
      return `<tr>${columns.map(c => {
        if (totalsKeys && totalsKeys.includes(c.key)) {
          const sum = sumOf(rows, c.key);
          return `<td class="num">${fmtMoney(sum)}</td>`;
        }
        return `<td>${c === columns[0] ? "Total" : ""}</td>`;
      }).join("")}<td></td></tr>`;
    }

    function bind() {
      mount.querySelectorAll("[data-row]").forEach(tr => {
        const idx = Number(tr.dataset.row);
        tr.querySelectorAll("[data-key]").forEach(el => {
          // Save on three triggers — change (date-picker pick, select),
          // blur (click-away after typing), and Enter (commit + blur).
          // saveCell short-circuits if the value didn't actually change.
          const saveCell = async () => {
            const key = el.dataset.key;
            const raw = el.value;
            let newVal;
            if (el.dataset.type === "number") {
              newVal = raw === "" ? 0 : Number(raw);
            } else if (el.dataset.type === "paid-toggle") {
              // Checkbox: checked stamps current YYYY-MM, unchecked clears it.
              newVal = el.checked ? currentYearMonth() : "";
            } else {
              newVal = raw;
            }
            if (rows[idx][key] === newVal) return;
            rows[idx][key] = newVal;
            await put(`/${resource}/${rows[idx].id}`, rows[idx]);
            if (totalsKeys) document.getElementById(`${id}-foot`).innerHTML = footerCells();
            window.dispatchEvent(new CustomEvent("budget:changed", {
              detail: { resource, action: "edit", id: rows[idx].id, key },
            }));
            el.classList.add("saved-flash");
            setTimeout(() => el.classList.remove("saved-flash"), 700);
          };
          el.addEventListener("change", saveCell);
          el.addEventListener("blur",   saveCell);
          el.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); el.blur(); }
          });
        });
        tr.querySelector("[data-del]").onclick = async () => {
          const removed = rows.splice(idx, 1)[0];
          await del(`/${resource}/${removed.id}`);
          render();
          window.dispatchEvent(new CustomEvent("budget:changed", {
            detail: { resource, action: "delete", id: removed.id },
          }));
        };
      });
      document.getElementById(`${id}-add`).onclick = async () => {
        const draft = { ...newRow(), ...extraNewFields };
        const created = await post(`/${resource}`, draft);
        rows.push(created);
        render();
        window.dispatchEvent(new CustomEvent("budget:changed", {
          detail: { resource, action: "add", id: created.id },
        }));
      };
    }

    render();
  }

  // ============================================================
  // 6. Sidebar wiring (snapshot button + live Chicago clock)
  // ============================================================
  function renderClock() {
    const el = document.getElementById("clock");
    if (!el) return;
    const now = new Date();
    const date = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    }).format(now);
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric", minute: "2-digit", hour12: true,
    }).format(now);
    // CST in winter, CDT in summer — derive the right abbreviation from the offset.
    const zoneName = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago", timeZoneName: "short",
    }).formatToParts(now).find(p => p.type === "timeZoneName").value;
    el.innerHTML = `
      <div class="time">${time}</div>
      <div>${date}</div>
      <div class="zone">Chicago · ${zoneName}</div>
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-snapshot").onclick = async () => {
      const label = prompt("Snapshot label (e.g. 2025-05):", new Date().toISOString().slice(0, 7));
      if (!label) return;
      await post("/snapshots", { label });
      toast(`Snapshot "${label}" saved`);
      await reload();
      if (location.hash === "#/reports") render();
    };

    renderClock();
    setInterval(renderClock, 30 * 1000);
  });

  // ============================================================
  // 7. Views
  // ============================================================
  const main = () => document.getElementById("main");

  // ---------- Dashboard ----------
  function viewDashboard() {
    const income     = calc.income();
    const expenses   = calc.expenses();
    const savings    = calc.savings();
    const ccExp      = calc.ccExpenses();
    const cash       = calc.cashBalance();
    const pctSpent   = calc.percentSpent();
    const difference = income - expenses;
    const kyleU      = calc.cardUtil(state.ccUtilization.kyle);
    const vishaU     = calc.cardUtil(state.ccUtilization.visha);

    main().innerHTML = `
      <div class="page-head">
        <div>
          <h1>Dashboard</h1>
          <div class="subtitle">${esc(state.meta.householdName)} · monthly snapshot</div>
        </div>
        <div class="btn-row">
          <a class="btn"         href="#/income">+ Income</a>
          <a class="btn"         href="#/expenses">+ Expense</a>
          <a class="btn primary" href="#/reports">View reports</a>
        </div>
      </div>

      <div class="grid grid-4">
        <div class="card stat"><div class="label">Total Monthly Income</div>
          <div class="value pos">${fmtMoney(income)}</div>
          <div class="delta">${state.income.length} sources</div></div>
        <div class="card stat"><div class="label">Total Monthly Expenses</div>
          <div class="value neg">${fmtMoney(expenses)}</div>
          <div class="delta">${state.expenses.length} bills</div></div>
        <div class="card stat"><div class="label">Total Monthly Savings</div>
          <div class="value">${fmtMoney(savings)}</div>
          <div class="delta">across ${state.savings.length} accounts</div></div>
        <div class="card stat"><div class="label">Cash Balance (Projected)</div>
          <div class="value ${cash >= 0 ? "pos" : "neg"}">${fmtMoney(cash)}</div>
          <div class="delta">income − expenses − savings</div></div>
      </div>

      <div class="grid grid-2" style="margin-top:16px;">
        <div class="card">
          <h2>Income vs Expenses</h2>
          <div class="chart-wrap"><canvas id="chartIE"></canvas></div>
          <div style="display:flex; justify-content:space-between; gap:12px; margin-top:12px; font-size:12.5px; color:var(--muted);">
            <span><span class="swatch" style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#25c285;vertical-align:middle;margin-right:6px;"></span>Income ${fmtMoney(income)}</span>
            <span><span class="swatch" style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#ef5b6b;vertical-align:middle;margin-right:6px;"></span>Expenses ${fmtMoney(expenses)}</span>
            <span><b style="color:${difference >= 0 ? "var(--success)" : "var(--danger)"}">${difference >= 0 ? "+" : ""}${fmtMoney(difference)}</b> difference</span>
          </div>
        </div>
        <div class="card">
          <h2>Percentage of Income Spent</h2>
          <div class="chart-wrap"><canvas id="chartSpent"></canvas></div>
          <div style="text-align:center; margin-top:8px; font-size:13px; color:var(--muted);">
            ${fmtMoney(expenses + savings)} of ${fmtMoney(income)} committed
          </div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-top:16px;">
        <div class="card">
          <h2>Credit Card Utilization</h2>
          <div class="chart-wrap"><canvas id="chartUtil"></canvas></div>
          <div class="legend">
            <div class="item"><span class="swatch" style="background:#4c8bf5"></span>Kyle ${fmtPct(kyleU.pct)}</div>
            <div class="item"><span class="swatch" style="background:#b07dff"></span>Visha ${fmtPct(vishaU.pct)}</div>
          </div>
        </div>
        <div class="card">
          <h2>Upcoming Bills (next 30 days)</h2>
          <div id="upcoming" style="max-height:300px; overflow-y:auto;"></div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-top:16px;">
        <div class="card"><h2>Legend</h2>
          <div class="legend-grid">
            <b>MS</b><span>Monthly Subscription</span>
            <b>E3M</b><span>Every 3 months</span>
            <b>ANN</b><span>Annual</span>
            <b>MS-CC</b><span>CC on CC (After Pay uses Apple CC)</span>
            <b>K</b><span>Kyle</span>
            <b>V</b><span>Visha</span>
          </div>
        </div>
        <div class="card"><h2>Quick Notes</h2>
          <div style="color:var(--muted); font-size:13px;">
            Saves to SQLite on the server. Use <b>Save monthly snapshot</b> in the
            sidebar to archive this month's numbers, then edit going forward.
            Snapshots power the Reports page.
          </div>
        </div>
      </div>
    `;

    new Chart(document.getElementById("chartIE"), {
      type: "bar",
      data: {
        labels: ["Income", "Expenses"],
        datasets: [{
          data: [income, expenses],
          backgroundColor: ["#25c285", "#ef5b6b"],
          borderRadius: 6,
          barPercentage: 0.55,
          categoryPercentage: 0.7,
        }],
      },
      options: chartAxisOpts({ moneyY: true, hideLegend: true }),
    });

    new Chart(document.getElementById("chartSpent"), {
      type: "doughnut",
      data: {
        labels: ["Spent + Saved", "Remaining"],
        datasets: [{
          data: [expenses + savings, Math.max(income - expenses - savings, 0)],
          backgroundColor: ["#ef5b6b", "#4c8bf5"],
          borderWidth: 0,
        }],
      },
      options: {
        cutout: "72%",
        plugins: {
          legend:  { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmtMoney(ctx.raw)}` } },
          centerText: { text: fmtPct(pctSpent, 0), sub: "of income spent", size: 42 },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    new Chart(document.getElementById("chartUtil"), {
      type: "bar",
      data: {
        labels: ["Kyle Sr", "Visha"],
        datasets: [
          { label: "Balance", data: [kyleU.bal, vishaU.bal], backgroundColor: "#ef5b6b", borderRadius: 6 },
          { label: "Limit",   data: [kyleU.lim, vishaU.lim], backgroundColor: "#2a3140", borderRadius: 6 },
        ],
      },
      options: chartAxisOpts({ moneyY: true }),
    });

    // Upcoming bills (next 30 days, treating each bill's date as a monthly recurrence)
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const in30  = new Date(today); in30.setDate(in30.getDate() + 30);
    const upcoming = state.expenses.map(e => {
      const d = parseLocalDate(e.dueDate);
      if (!d) return null;
      const day = d.getDate();
      let next = new Date(today.getFullYear(), today.getMonth(), day);
      if (next < today) next = new Date(today.getFullYear(), today.getMonth() + 1, day);
      return next <= in30 ? { ...e, next } : null;
    }).filter(Boolean).sort((a, b) => a.next - b.next);

    const ub = document.getElementById("upcoming");
    if (!upcoming.length) {
      ub.innerHTML = `<div class="empty">No bills due in the next 30 days.</div>`;
    } else {
      ub.innerHTML = `<table class="bdg">
        <thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th></tr></thead>
        <tbody>${upcoming.map(e => `<tr>
          <td>${tagFor(e.item)} ${esc(e.item)}</td>
          <td>${fmtDate(e.next)}</td>
          <td class="num">${fmtMoney(e.amount)}</td>
        </tr>`).join("")}</tbody>
      </table>`;
    }
  }

  // ---------- Income ----------
  function viewIncome() {
    main().innerHTML = `
      <div class="page-head">
        <div><h1>Income</h1><div class="subtitle">Edit any row inline — totals update live and autosave.</div></div>
        <div class="card stat" style="min-width:240px;">
          <div class="label">Total Monthly Income</div>
          <div class="value pos" id="totalLabel">${fmtMoney(calc.income())}</div>
        </div>
      </div>
      <div class="card"><h2>Monthly Income Sources</h2><div id="tbl"></div></div>
      <div class="notice">Tip: use a <b>K:</b> or <b>V:</b> prefix in the item name (e.g. "K: VA Disability") to tag it by person — the dashboard recognizes that convention.</div>
    `;
    editableTable({
      mount:      document.getElementById("tbl"),
      resource:   "income",
      rows:       state.income,
      columns: [
        { key: "item",   label: "Source", type: "text" },
        { key: "amount", label: "Amount", type: "number", align: "right", width: "180px" },
      ],
      totalsKeys: ["amount"],
      newRow:     () => ({ item: "", amount: 0 }),
      addLabel:   "+ Add income source",
    });
    window.addEventListener("budget:changed", refreshIncomeTotal, { once: true });
    function refreshIncomeTotal() {
      document.getElementById("totalLabel").textContent = fmtMoney(sumOf(state.income, "amount"));
    }
  }

  // ---------- Expenses ----------
  const PAY_PERIODS_EXP = [
    "", "Credit Card", "MS", "MS - CC", "E3M", "ANN",
    "Yearly 660", "Manually", "owe 19k", "owe 49k", "owe 560k",
    "owe 2200", "Owe IRS 20k", "until July", "credit monitoring",
  ];

  function viewExpenses() {
    // Excel-style per-column filters. null = nothing filtered for this column.
    const filters = { item: null, dueDate: null, amount: null, payPeriod: null };
    let pendingNewId = null;

    // Day-of-month sort (recurring bills repeat on the same day each month).
    const dayOf = (r) => {
      const d = parseLocalDate(r.dueDate);
      return d ? d.getDate() : 999;
    };
    const sortByDueDate = () => {
      state.expenses.sort((a, b) => dayOf(a) - dayOf(b));
    };

    sortByDueDate();

    main().innerHTML = `
      <div class="page-head">
        <div><h1>Expenses</h1><div class="subtitle">Click <b>&#9662;</b> in a column header to sort &amp; filter — like Excel.</div></div>
        <div class="card stat" style="min-width:260px;">
          <div class="label">Total Monthly Expenses</div>
          <div class="value neg" id="totalLabel">${fmtMoney(calc.expenses())}</div>
          <div class="delta" id="paidProgress"></div>
          <div class="delta" id="filteredHint" style="display:none;"></div>
        </div>
      </div>

      <div class="card">
        <div class="btn-row" style="margin-bottom:12px;">
          <button class="btn primary" id="btnSortByDate">↻ Refresh order (by due date)</button>
          <button class="btn"         id="btnClearFilters">Clear all filters</button>
        </div>
        <div id="tbl"></div>
      </div>

      <div class="grid grid-2" style="margin-top:16px;">
        <div class="card"><h2>By Pay Period</h2><div id="byPeriod"></div></div>
        <div class="card"><h2>Top 10 Expenses</h2><div id="top5"></div></div>
      </div>
    `;

    const remountTable = () => {
      editableTable({
        mount:    document.getElementById("tbl"),
        resource: "expenses",
        rows:     state.expenses,
        columns: [
          { key: "paidMonth", label: "✓",          type: "paid-toggle", width: "48px" },
          { key: "item",      label: "Bill",       type: "text",                                                  filterable: true },
          { key: "dueDate",   label: "Due Date",   type: "date",   width: "160px", autoRoll: true,                filterable: true },
          { key: "amount",    label: "Amount",     type: "number", align: "right", width: "140px",                filterable: true },
          { key: "payPeriod", label: "Pay Period", type: "select", options: PAY_PERIODS_EXP, width: "180px",      filterable: true },
        ],
        totalsKeys: ["amount"],
        newRow:     () => ({ item: "", dueDate: "", amount: 0, payPeriod: "", paidMonth: "" }),
        addLabel:   "+ Add expense",
      });
      wireColumnFilters();
      applyFilters();
      markPaidRows();
    };

    // Dim rows that have been marked paid for the current month.
    const markPaidRows = () => {
      const ym = currentYearMonth();
      document.querySelectorAll("#tbl tbody tr[data-row]").forEach((tr) => {
        const idx = Number(tr.dataset.row);
        const r = state.expenses[idx];
        tr.classList.toggle("paid", !!r && r.paidMonth === ym);
      });
      // Stat line under the total: "X of Y paid · $Z left"
      const ym2 = currentYearMonth();
      const total = state.expenses.length;
      const paid  = state.expenses.filter((r) => r.paidMonth === ym2).length;
      const unpaidAmount = state.expenses
        .filter((r) => r.paidMonth !== ym2)
        .reduce((s, r) => s + (Number(r.amount) || 0), 0);
      const el = document.getElementById("paidProgress");
      if (el) el.innerHTML = `${paid} of ${total} paid · <b>${fmtMoney(unpaidAmount)}</b> left`;
    };

    // ---------- column filter popup ----------
    const closeFilterPopup = () =>
      document.querySelectorAll(".col-filter-popup").forEach((p) => p.remove());

    function wireColumnFilters() {
      document.querySelectorAll("#tbl .col-filter-btn").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          openFilterPopup(btn);
        };
        btn.classList.toggle("active", filters[btn.dataset.col] !== null);
      });
    }

    function uniqueValuesFor(col) {
      const seen = new Map();
      state.expenses.forEach((r) => {
        const raw = r[col] == null ? "" : String(r[col]);
        if (seen.has(raw)) return;
        let display;
        if (col === "dueDate") display = raw ? fmtDate(currentMonthDate(raw)) : "(no date)";
        else if (col === "amount") display = fmtMoney(Number(raw));
        else display = raw || "(empty)";
        seen.set(raw, display);
      });
      // Sort options sensibly: amount numerically, dueDate by day, item alphabetically.
      const entries = [...seen.entries()].map(([raw, display]) => ({ raw, display }));
      if (col === "dueDate") {
        entries.sort((a, b) => {
          const ad = a.raw ? parseLocalDate(a.raw)?.getDate() ?? 999 : 999;
          const bd = b.raw ? parseLocalDate(b.raw)?.getDate() ?? 999 : 999;
          return ad - bd;
        });
      } else if (col === "amount") {
        entries.sort((a, b) => Number(a.raw) - Number(b.raw));
      } else {
        entries.sort((a, b) => a.display.localeCompare(b.display));
      }
      return entries;
    }

    function openFilterPopup(btn) {
      closeFilterPopup();
      const col = btn.dataset.col;
      const values = uniqueValuesFor(col);
      const allowed = filters[col]; // Set | null
      const isFiltering = !!allowed;

      const popup = document.createElement("div");
      popup.className = "col-filter-popup";
      popup.onclick = (e) => e.stopPropagation();
      popup.innerHTML = `
        <div class="popup-section">
          <button class="popup-action" data-action="sort-asc">↑ Sort ${col === "amount" ? "Smallest → Largest" : col === "dueDate" ? "Earliest → Latest" : "A → Z"}</button>
          <button class="popup-action" data-action="sort-desc">↓ Sort ${col === "amount" ? "Largest → Smallest" : col === "dueDate" ? "Latest → Earliest" : "Z → A"}</button>
        </div>
        <div class="popup-divider"></div>
        <input class="filter-input small" placeholder="Search…" id="popup-search">
        <div class="popup-list" id="popup-list">
          <label class="popup-item"><input type="checkbox" id="popup-all" ${!isFiltering ? "checked" : ""}> <b>(Select All)</b></label>
          ${values.map((v) => `
            <label class="popup-item"><input type="checkbox" data-raw="${attr(v.raw)}" ${!isFiltering || allowed.has(v.raw) ? "checked" : ""}> ${esc(v.display)}</label>
          `).join("")}
        </div>
        <div class="popup-buttons">
          <button class="btn primary" data-action="apply">OK</button>
          <button class="btn"         data-action="clear">Clear filter</button>
        </div>
      `;
      document.body.appendChild(popup);

      // Position below the button (clamp to viewport).
      const rect = btn.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();
      let left = rect.left + window.scrollX;
      if (left + popupRect.width > window.scrollX + window.innerWidth - 8) {
        left = window.scrollX + window.innerWidth - popupRect.width - 8;
      }
      popup.style.position = "absolute";
      popup.style.top  = `${rect.bottom + window.scrollY + 4}px`;
      popup.style.left = `${left}px`;

      const allCb = popup.querySelector("#popup-all");
      const itemCbs = () => popup.querySelectorAll("#popup-list input[type=checkbox][data-raw]");
      allCb.onchange = () => itemCbs().forEach((c) => (c.checked = allCb.checked));
      itemCbs().forEach((c) => {
        c.onchange = () => {
          allCb.checked = [...itemCbs()].every((x) => x.checked);
        };
      });
      popup.querySelector("#popup-search").oninput = (e) => {
        const q = e.target.value.toLowerCase();
        popup.querySelectorAll("#popup-list .popup-item").forEach((item) => {
          if (item.querySelector("#popup-all")) return;
          item.style.display = item.textContent.toLowerCase().includes(q) ? "" : "none";
        });
      };

      popup.querySelectorAll("[data-action]").forEach((b) => {
        b.onclick = () => {
          const action = b.dataset.action;
          if (action === "sort-asc" || action === "sort-desc") {
            state.expenses.sort((a, b) => compareCol(col, a, b, action === "sort-desc"));
            closeFilterPopup();
            remountTable();
          } else if (action === "apply") {
            if (allCb.checked) {
              filters[col] = null;
            } else {
              const chosen = [...itemCbs()].filter((c) => c.checked).map((c) => c.dataset.raw);
              filters[col] = new Set(chosen);
            }
            closeFilterPopup();
            applyFilters();
            wireColumnFilters();
          } else if (action === "clear") {
            filters[col] = null;
            closeFilterPopup();
            applyFilters();
            wireColumnFilters();
          }
        };
      });

      // Click outside to dismiss.
      setTimeout(() => document.addEventListener("click", closeFilterPopup, { once: true }), 0);
    }

    function compareCol(col, a, b, desc) {
      let av, bv;
      if (col === "dueDate") {
        av = dayOf(a); bv = dayOf(b);
      } else if (col === "amount") {
        av = Number(a.amount) || 0; bv = Number(b.amount) || 0;
      } else {
        av = (a[col] || "").toLowerCase(); bv = (b[col] || "").toLowerCase();
      }
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return 0;
    }

    function applyFilters() {
      let visible = 0, visibleTotal = 0;
      document.querySelectorAll("#tbl table tbody tr[data-row]").forEach((tr) => {
        const idx = Number(tr.dataset.row);
        const r = state.expenses[idx];
        if (!r) { tr.style.display = "none"; return; }
        let show = true;
        for (const [col, allowed] of Object.entries(filters)) {
          if (!allowed) continue;
          const raw = r[col] == null ? "" : String(r[col]);
          if (!allowed.has(raw)) { show = false; break; }
        }
        tr.style.display = show ? "" : "none";
        if (show) { visible++; visibleTotal += Number(r.amount) || 0; }
      });
      const hint = document.getElementById("filteredHint");
      if (!hint) return;
      const filtering = Object.values(filters).some((f) => f !== null);
      if (filtering) {
        hint.style.display = "";
        hint.innerHTML = `${visible} of ${state.expenses.length} shown · <b>${fmtMoney(visibleTotal)}</b> filtered`;
      } else {
        hint.style.display = "none";
      }
    }

    // ---------- top-bar buttons ----------
    document.getElementById("btnSortByDate").onclick = () => {
      sortByDueDate();
      remountTable();
      toast("Sorted by due date");
    };
    document.getElementById("btnClearFilters").onclick = () => {
      for (const k of Object.keys(filters)) filters[k] = null;
      applyFilters();
      wireColumnFilters();
    };

    // ---------- summary cards + new-row auto-resort ----------
    const renderSummaries = () => {
      const tlEl = document.getElementById("totalLabel");
      if (!tlEl) return;
      const byP = {};
      state.expenses.forEach((e) => {
        const k = e.payPeriod || "—";
        byP[k] = (byP[k] || 0) + (Number(e.amount) || 0);
      });
      document.getElementById("byPeriod").innerHTML = `<table class="bdg">
        <thead><tr><th>Period</th><th class="num">Total</th></tr></thead>
        <tbody>${Object.entries(byP).sort((a, b) => b[1] - a[1]).map(([p, s]) =>
          `<tr><td>${esc(p)}</td><td class="num">${fmtMoney(s)}</td></tr>`
        ).join("") || `<tr><td colspan="2" class="empty">No data</td></tr>`}</tbody>
      </table>`;
      const top = [...state.expenses].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0)).slice(0, 10);
      document.getElementById("top5").innerHTML = `<table class="bdg">
        <thead><tr><th>Bill</th><th class="num">Amount</th></tr></thead>
        <tbody>${top.map((e) => `<tr><td>${esc(e.item)}</td><td class="num">${fmtMoney(e.amount)}</td></tr>`).join("")
          || `<tr><td colspan="2" class="empty">No data</td></tr>`}</tbody>
      </table>`;
      tlEl.textContent = fmtMoney(calc.expenses());
      applyFilters();
    };

    const onChange = (e) => {
      const d = e.detail;
      if (d?.resource === "expenses" && d.action === "add") {
        pendingNewId = d.id;
      }
      // When the newly-added row's due date is saved, slot it into order.
      if (d?.resource === "expenses" && d.action === "edit"
          && d.id === pendingNewId && d.key === "dueDate") {
        pendingNewId = null;
        sortByDueDate();
        remountTable();
        toast("New row sorted into place");
      }
      renderSummaries();
      markPaidRows();
    };
    window.addEventListener("budget:changed", onChange);

    remountTable();
    renderSummaries();
  }

  // ---------- Savings ----------
  function viewSavings() {
    main().innerHTML = `
      <div class="page-head">
        <div><h1>Savings Goals</h1><div class="subtitle">Track monthly contributions and progress toward each goal.</div></div>
      </div>
      <div class="grid grid-3">
        <div class="card stat"><div class="label">Total Saved (this month)</div><div class="value pos" id="totalSaved">${fmtMoney(calc.savings())}</div></div>
        <div class="card stat"><div class="label">All-Time Saved</div><div class="value" id="lifetimeSaved"></div></div>
        <div class="card stat"><div class="label">Overall Goal Progress</div>
          <div class="value" id="overallPct"></div>
          <div class="bar good" style="margin-top:10px;"><span id="overallBar"></span></div>
        </div>
      </div>
      <div class="card" style="margin-top:16px;"><h2>Savings Plan</h2><div id="tbl"></div></div>
      <div class="card" style="margin-top:16px;"><h2>Goals</h2><div id="goalCards" class="grid grid-3"></div></div>
    `;
    editableTable({
      mount:    document.getElementById("tbl"),
      resource: "savings",
      rows:     state.savings,
      columns: [
        { key: "item",             label: "Account",           type: "text" },
        { key: "contributionDays", label: "Contribution Days", type: "text",   width: "180px" },
        { key: "amount",           label: "This Month",        type: "number", align: "right", width: "140px" },
        { key: "saved",            label: "All-Time Saved",    type: "number", align: "right", width: "150px" },
        { key: "goal",             label: "Goal",              type: "number", align: "right", width: "140px" },
      ],
      totalsKeys: ["amount", "saved", "goal"],
      newRow:     () => ({ item: "", contributionDays: "", amount: 0, saved: 0, goal: 0 }),
      addLabel:   "+ Add savings goal",
    });

    const refresh = () => {
      const { saved, pct } = calc.goalProgress();
      document.getElementById("totalSaved").textContent    = fmtMoney(calc.savings());
      document.getElementById("lifetimeSaved").textContent = fmtMoney(saved);
      document.getElementById("overallPct").textContent    = fmtPct(pct);
      document.getElementById("overallBar").style.width    = Math.min(pct * 100, 100) + "%";
      document.getElementById("goalCards").innerHTML = state.savings.map(s => {
        const p = (Number(s.goal) || 0) > 0 ? (Number(s.saved) || 0) / s.goal : 0;
        const rem = Math.max((Number(s.goal) || 0) - (Number(s.saved) || 0), 0);
        return `<div class="card" style="padding:14px;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px;">
            <b style="font-size:14px;">${esc(s.item || "Untitled")}</b>
            <span class="tag">${fmtPct(p)}</span>
          </div>
          <div style="color:var(--muted); font-size:12px; margin-top:4px;">${fmtMoney(s.saved)} of ${fmtMoney(s.goal)}</div>
          <div class="bar ${p >= 1 ? "good" : ""}" style="margin-top:10px;"><span style="width:${Math.min(p * 100, 100)}%"></span></div>
          <div style="color:var(--muted); font-size:12px; margin-top:8px;">
            ${rem > 0 ? fmtMoney(rem) + " remaining" : "Goal reached"}
          </div>
        </div>`;
      }).join("") || `<div class="empty">No goals yet.</div>`;
    };
    refresh();
    window.addEventListener("budget:changed", refresh);
  }

  // ---------- Credit Cards ----------
  const PAY_PERIODS_CC = ["", "MS - CC", "MS", "E3M", "ANN", "Yearly 660", "credit monitoring"];

  // Card options for the recurring-charges filter + dropdown.
  // Built from the cc_utilization tables: real full names (K: Capital One
  // Savor, V: Chase, …) — each card has its own subscriptions, so the
  // generic issuer buckets are intentionally not allowed here.
  function cardOptions() {
    const seen = new Map();
    for (const c of [...state.ccUtilization.kyle, ...state.ccUtilization.visha]) {
      const isPrimary = (c.name.startsWith("K:") && c.owner === "kyle")
                     || (c.name.startsWith("V:") && c.owner === "visha");
      if (!seen.has(c.name) || isPrimary) seen.set(c.name, c);
    }
    return [...seen.keys()].sort();
  }

  function viewCreditCards() {
    // Color thresholds (same across the overall Kyle/Visha boxes and the
    // per-card grid):  ≤ 6% → green   ·   > 6%–30% → yellow   ·   > 30% → red.
    const utilColor = (p) => p > 0.30 ? "neg"  : (p <= 0.06 ? "pos"  : "warn-text");
    const barClass  = (p) => p > 0.30 ? "warn" : (p <= 0.06 ? "good" : "mid");

    // Dedupe by card name (V: cards appear on both lists since Kyle is auth
    // user). Use the primary holder's record where both exist.
    const uniqueCards = () => {
      const seen = new Map();
      for (const c of [...state.ccUtilization.kyle, ...state.ccUtilization.visha]) {
        const isPrimary = (c.name.startsWith("K:") && c.owner === "kyle")
                       || (c.name.startsWith("V:") && c.owner === "visha");
        if (!seen.has(c.name) || isPrimary) seen.set(c.name, c);
      }
      return [...seen.values()];
    };

    const renderTopStatsHTML = () => {
      const k = calc.cardUtil(state.ccUtilization.kyle);
      const v = calc.cardUtil(state.ccUtilization.visha);
      const kylePrimary  = state.ccUtilization.kyle.filter(c => c.name.startsWith("K:")).length;
      const vishaPrimary = state.ccUtilization.visha.filter(c => c.name.startsWith("V:")).length;
      return `
        <div class="card stat"><div class="label">Kyle — Utilization</div>
          <div class="value ${utilColor(k.pct)}">${fmtPct(k.pct)}</div>
          <div class="delta">${fmtMoney(k.bal)} / ${fmtMoney(k.lim)}</div>
          <div class="bar ${barClass(k.pct)}" style="margin-top:10px;"><span style="width:${Math.min(k.pct * 100, 100)}%"></span></div></div>
        <div class="card stat"><div class="label">Visha — Utilization</div>
          <div class="value ${utilColor(v.pct)}">${fmtPct(v.pct)}</div>
          <div class="delta">${fmtMoney(v.bal)} / ${fmtMoney(v.lim)}</div>
          <div class="bar ${barClass(v.pct)}" style="margin-top:10px;"><span style="width:${Math.min(v.pct * 100, 100)}%"></span></div></div>
        <div class="card stat"><div class="label">Cards Tracked</div>
          <div class="value">${kylePrimary + vishaPrimary}</div>
          <div class="delta">Kyle ${kylePrimary} · Visha ${vishaPrimary} (primary holders)</div></div>
        <div class="card stat"><div class="label">Recurring CC Charges</div>
          <div class="value">${fmtMoney(calc.ccExpenses())}</div>
          <div class="delta">${state.ccExpenses.length} items</div></div>
      `;
    };

    const renderPerCardHTML = () => {
      const cards = uniqueCards()
        .map(c => ({ ...c, pct: c.creditLimit > 0 ? c.balance / c.creditLimit : 0 }))
        .sort((a, b) => b.pct - a.pct);  // highest utilization first
      if (!cards.length) return `<div class="empty">No cards tracked yet.</div>`;
      return cards.map(c => `
        <div class="card per-card-util">
          <div class="cc-name">${esc(c.name)}</div>
          <div class="cc-pct ${utilColor(c.pct)}">${fmtPct(c.pct, 0)}</div>
          <div class="cc-meta">${fmtMoney(c.balance)} / ${fmtMoney(c.creditLimit)}</div>
          <div class="bar ${barClass(c.pct)}" style="margin-top:8px;"><span style="width:${Math.min(c.pct * 100, 100)}%"></span></div>
        </div>
      `).join("");
    };

    main().innerHTML = `
      <div class="page-head">
        <div><h1>Credit Cards</h1><div class="subtitle">Utilization, balances, and recurring card charges. Per-card percentages update live as balances and limits change.</div></div>
      </div>

      <div class="grid grid-4" id="ccTopStats">${renderTopStatsHTML()}</div>

      <div class="card" style="margin-top:16px;">
        <h2>Utilization by Card</h2>
        <div class="grid per-card-grid" id="perCardBox">${renderPerCardHTML()}</div>
        <div class="util-legend">
          <span class="util-key"><span class="dot pos"></span>≤ 6%</span>
          <span class="util-key"><span class="dot warn-text"></span>6 – 30%</span>
          <span class="util-key"><span class="dot neg"></span>&gt; 30%</span>
        </div>
      </div>

      <div class="card" style="margin-top:16px;"><h2>Utilization Chart</h2>
        <div class="chart-wrap"><canvas id="utilChart"></canvas></div>
      </div>

      <div class="grid grid-2" style="margin-top:16px;">
        <div class="card"><h2>Kyle Sr — Card Utilization</h2><div id="kyleTbl"></div></div>
        <div class="card"><h2>Visha — Card Utilization</h2><div id="vishaTbl"></div></div>
      </div>

      <div class="card" style="margin-top:16px;"><h2>Recurring Charges by Card</h2>
        <div class="btn-row" id="cardFilters" style="margin-bottom:14px;"></div>
        <div id="ccExpTbl"></div>
      </div>
    `;

    // Re-render every utilization view whenever a card edit lands.
    const refreshUtilViews = () => {
      const topEl = document.getElementById("ccTopStats");
      const perEl = document.getElementById("perCardBox");
      if (!topEl || !perEl) return;
      topEl.innerHTML = renderTopStatsHTML();
      perEl.innerHTML = renderPerCardHTML();
      renderUtilChart();
    };
    window.addEventListener("budget:changed", refreshUtilViews);

    editableTable({
      mount:    document.getElementById("kyleTbl"),
      resource: "cc-utilization",
      rows:     state.ccUtilization.kyle,
      columns: [
        { key: "name",        label: "Card",    type: "text" },
        { key: "date",        label: "Date",    type: "date",   width: "150px", autoRoll: true },
        { key: "balance",     label: "Balance", type: "number", align: "right", width: "130px" },
        { key: "creditLimit", label: "Limit",   type: "number", align: "right", width: "130px" },
      ],
      totalsKeys: ["balance", "creditLimit"],
      newRow:     () => ({ name: "", date: new Date().toISOString().slice(0, 10), balance: 0, creditLimit: 0 }),
      extraNewFields: { owner: "kyle" },
      addLabel:   "+ Add card",
    });
    editableTable({
      mount:    document.getElementById("vishaTbl"),
      resource: "cc-utilization",
      rows:     state.ccUtilization.visha,
      columns: [
        { key: "name",        label: "Card",    type: "text" },
        { key: "date",        label: "Date",    type: "date",   width: "150px", autoRoll: true },
        { key: "balance",     label: "Balance", type: "number", align: "right", width: "130px" },
        { key: "creditLimit", label: "Limit",   type: "number", align: "right", width: "130px" },
      ],
      totalsKeys: ["balance", "creditLimit"],
      newRow:     () => ({ name: "", date: new Date().toISOString().slice(0, 10), balance: 0, creditLimit: 0 }),
      extraNewFields: { owner: "visha" },
      addLabel:   "+ Add card",
    });

    const renderUtilChart = () => {
      if (window.__utilChart) window.__utilChart.destroy();

      // V: cards live in both lists (Visha is primary, Kyle is auth user on
      // her credit). Dedupe by card name for the combined chart, preferring
      // the primary holder's record (K: → kyle, V: → visha) when both exist.
      const seen = new Map();
      for (const c of [...state.ccUtilization.kyle, ...state.ccUtilization.visha]) {
        const isPrimary = (c.name.startsWith("K:") && c.owner === "kyle")
                       || (c.name.startsWith("V:") && c.owner === "visha");
        if (!seen.has(c.name) || isPrimary) seen.set(c.name, c);
      }
      const unique = [...seen.values()];

      window.__utilChart = new Chart(document.getElementById("utilChart"), {
        type: "bar",
        data: {
          labels: unique.map(c => c.name),
          datasets: [
            { label: "Balance", data: unique.map(c => c.balance),     backgroundColor: "#ef5b6b", borderRadius: 4 },
            { label: "Limit",   data: unique.map(c => c.creditLimit), backgroundColor: "#2a3140", borderRadius: 4 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend:  { labels: { color: "#98a1b3" } },
            tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmtMoney(ctx.raw)}` } },
          },
          scales: {
            x: { ticks: { color: "#98a1b3", maxRotation: 60, minRotation: 45 }, grid: { color: "rgba(255,255,255,.04)" } },
            y: { beginAtZero: true, ticks: { color: "#98a1b3", callback: v => "$" + new Intl.NumberFormat().format(v) }, grid: { color: "rgba(255,255,255,.04)" } },
          },
        },
      });
    };
    renderUtilChart();
    // (the per-card box + top stats + chart all re-render via refreshUtilViews
    //  above — no separate listener for the chart alone.)

    const CARDS = cardOptions();
    let currentFilter = "All";
    const renderFilters = () => {
      document.getElementById("cardFilters").innerHTML = ["All", ...CARDS].map(c =>
        `<button class="btn ${c === currentFilter ? "primary" : ""}" data-card="${attr(c)}">${esc(c)}</button>`
      ).join("");
      document.querySelectorAll("#cardFilters .btn").forEach(b => {
        b.onclick = () => { currentFilter = b.dataset.card; renderFilters(); renderCcExpTable(); };
      });
    };
    const renderCcExpTable = () => {
      const rows = currentFilter === "All"
        ? state.ccExpenses
        : state.ccExpenses.filter(e => e.card === currentFilter);
      editableTable({
        mount:    document.getElementById("ccExpTbl"),
        resource: "cc-expenses",
        rows,
        columns: [
          { key: "card",      label: "Card",       type: "select", options: ["", ...CARDS], width: "220px" },
          { key: "item",      label: "Item",       type: "text" },
          { key: "dueDate",   label: "Due Date",   type: "date",   width: "150px", autoRoll: true },
          { key: "amount",    label: "Amount",     type: "number", align: "right", width: "130px" },
          { key: "payPeriod", label: "Pay Period", type: "select", options: PAY_PERIODS_CC, width: "160px" },
        ],
        totalsKeys: ["amount"],
        newRow:     () => ({
          card: currentFilter === "All" ? (CARDS[0] || "") : currentFilter,
          item: "", dueDate: "", amount: 0, payPeriod: "MS - CC",
        }),
        addLabel: "+ Add charge",
      });
    };
    renderFilters();
    renderCcExpTable();
  }

  // ---------- Reports ----------
  function viewReports() {
    const labels    = state.snapshots.map(s => s.label);
    const liveTotals = {
      income:      calc.income(),
      expenses:    calc.expenses(),
      savings:     calc.savings(),
      ccExpenses:  calc.ccExpenses(),
      cashBalance: calc.cashBalance(),
    };
    const allLabels = [...labels, "Current (live)"];
    const allTotals = [...state.snapshots.map(s => s.totals), liveTotals];

    main().innerHTML = `
      <div class="page-head">
        <div><h1>Reports</h1><div class="subtitle">Month-over-month trends. Use "Save monthly snapshot" in the sidebar to archive a month.</div></div>
      </div>
      ${labels.length === 0 ? `
        <div class="card" style="text-align:center; padding:48px;">
          <div style="font-size:18px; font-weight:600; margin-bottom:8px;">No snapshots yet</div>
          <div style="color:var(--muted); max-width:520px; margin:0 auto;">
            Click <b>Save monthly snapshot</b> in the sidebar to archive this month.
            Once you have two or more snapshots, you'll see trend charts and deltas here.
          </div>
          <div style="margin-top:20px;"><button class="btn primary" id="quickSnap">Save current month as snapshot</button></div>
        </div>
      ` : `
        <div class="grid grid-2">
          <div class="card"><h2>Income vs Expenses (by month)</h2><div class="chart-wrap"><canvas id="trendChart"></canvas></div></div>
          <div class="card"><h2>Cash Balance Trend</h2><div class="chart-wrap"><canvas id="cashChart"></canvas></div></div>
        </div>
        <div class="card" style="margin-top:16px;"><h2>Snapshot Comparison</h2>
          <div class="scroll-x"><table class="bdg">
            <thead><tr>
              <th>Metric</th>
              ${allLabels.map(l => `<th class="num">${esc(l)}</th>`).join("")}
              <th class="num">Δ vs ${esc(allLabels.length > 1 ? allLabels[allLabels.length - 2] : "—")}</th>
            </tr></thead>
            <tbody id="compareBody"></tbody>
          </table></div>
        </div>
        <div class="card" style="margin-top:16px;"><h2>Snapshots</h2><div id="snapList"></div></div>
      `}
    `;

    if (labels.length === 0) {
      document.getElementById("quickSnap").onclick = async () => {
        await post("/snapshots", {});
        toast("Snapshot saved — reloading");
        await reload();
        render();
      };
      return;
    }

    const lineOpts = () => ({
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend:  { labels: { color: "#98a1b3" } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmtMoney(ctx.raw)}` } },
      },
      scales: {
        x: { ticks: { color: "#98a1b3" }, grid: { color: "rgba(255,255,255,.04)" } },
        y: { beginAtZero: false, ticks: { color: "#98a1b3", callback: v => "$" + new Intl.NumberFormat().format(v) }, grid: { color: "rgba(255,255,255,.04)" } },
      },
    });
    new Chart(document.getElementById("trendChart"), {
      type: "line",
      data: {
        labels: allLabels,
        datasets: [
          { label: "Income",   data: allTotals.map(t => t.income),   borderColor: "#25c285", backgroundColor: "rgba(37,194,133,.15)", fill: true, tension: .3 },
          { label: "Expenses", data: allTotals.map(t => t.expenses), borderColor: "#ef5b6b", backgroundColor: "rgba(239,91,107,.15)", fill: true, tension: .3 },
          { label: "Savings",  data: allTotals.map(t => t.savings),  borderColor: "#4c8bf5", backgroundColor: "rgba(76,139,245,.10)", fill: true, tension: .3 },
        ],
      },
      options: lineOpts(),
    });
    new Chart(document.getElementById("cashChart"), {
      type: "line",
      data: {
        labels: allLabels,
        datasets: [{ label: "Cash Balance", data: allTotals.map(t => t.cashBalance), borderColor: "#b07dff", backgroundColor: "rgba(176,125,255,.15)", fill: true, tension: .3 }],
      },
      options: lineOpts(),
    });

    const metrics = [
      { key: "income",      label: "Income",       dir: "up"   },
      { key: "expenses",    label: "Expenses",     dir: "down" },
      { key: "savings",     label: "Savings",      dir: "up"   },
      { key: "ccExpenses",  label: "CC Spend",     dir: "down" },
      { key: "cashBalance", label: "Cash Balance", dir: "up"   },
    ];
    document.getElementById("compareBody").innerHTML = metrics.map(m => {
      const cells = allTotals.map(t => `<td class="num">${fmtMoney(t[m.key])}</td>`).join("");
      let delta = "—", color = "inherit";
      if (allTotals.length >= 2) {
        const last = allTotals[allTotals.length - 1][m.key];
        const prev = allTotals[allTotals.length - 2][m.key];
        const diff = last - prev;
        const good = (m.dir === "up" && diff > 0) || (m.dir === "down" && diff < 0);
        if (diff !== 0) color = good ? "var(--success)" : "var(--danger)";
        delta = (diff >= 0 ? "+" : "") + fmtMoney(diff);
      }
      return `<tr><td><b>${m.label}</b></td>${cells}<td class="num" style="color:${color}">${delta}</td></tr>`;
    }).join("");

    document.getElementById("snapList").innerHTML = `<table class="bdg">
      <thead><tr>
        <th>Label</th><th>Captured</th>
        <th class="num">Income</th><th class="num">Expenses</th><th class="num">Cash</th><th></th>
      </tr></thead>
      <tbody>${[...state.snapshots].reverse().map(s => `<tr>
        <td><b>${esc(s.label)}</b></td>
        <td>${new Date(s.capturedAt).toLocaleString()}</td>
        <td class="num">${fmtMoney(s.totals.income)}</td>
        <td class="num">${fmtMoney(s.totals.expenses)}</td>
        <td class="num">${fmtMoney(s.totals.cashBalance)}</td>
        <td><button class="btn danger" data-del="${attr(s.label)}">Delete</button></td>
      </tr>`).join("")}</tbody>
    </table>`;
    document.querySelectorAll("#snapList [data-del]").forEach(b => {
      b.onclick = async () => {
        if (!confirm(`Delete snapshot "${b.dataset.del}"?`)) return;
        await del(`/snapshots/${encodeURIComponent(b.dataset.del)}`);
        await reload();
        render();
      };
    });
  }

  // ============================================================
  // 8. Router & bootstrap
  // ============================================================
  const ROUTES = {
    "/dashboard":    viewDashboard,
    "/income":       viewIncome,
    "/expenses":     viewExpenses,
    "/savings":      viewSavings,
    "/credit-cards": viewCreditCards,
    "/reports":      viewReports,
  };

  async function render() {
    const path = location.hash.slice(1) || "/dashboard";
    const view = ROUTES[path] || ROUTES["/dashboard"];
    document.querySelectorAll(".nav a").forEach(a =>
      a.classList.toggle("active", a.dataset.route === path)
    );
    try {
      await reload();
      view();
    } catch (e) {
      main().innerHTML = `<div class="card"><h2>Couldn't reach the API</h2>
        <div style="color:var(--muted); margin-top:8px;">${esc(e.message)}</div></div>`;
    }
  }

  window.addEventListener("hashchange", render);
  if (!location.hash) location.hash = "#/dashboard";
  document.addEventListener("DOMContentLoaded", render);
})();
