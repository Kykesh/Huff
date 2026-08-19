// Populate the database with starter data taken from the original
// Excel snapshot. Run with: npm run seed
//
// By default this only seeds if `income` is empty, so it's safe to
// re-run. Pass --force to wipe and re-insert.

const path     = require("path");
const Database = require("better-sqlite3");
const { migrate } = require("./migrate");

const DB_PATH = path.join(__dirname, "..", "data", "app.db");
const FORCE   = process.argv.includes("--force");

const SEED = {
  meta: { household_name: "Huff Household" },

  income: [
    { id: "inc-1", item: "K: VA Disability", amount: 5050 },
    { id: "inc-2", item: "V: VA Disability", amount: 4500 },
    { id: "inc-3", item: "Trading Acct",     amount: 0    },
    { id: "inc-4", item: "USAA 1st",         amount: 2300 },
    { id: "inc-5", item: "USAA 2nd",         amount: 2300 },
    { id: "inc-6", item: "Petco 1st",        amount: 1700 },
    { id: "inc-7", item: "Petco 2nd",        amount: 1700 },
  ],

  expenses: [
    { id: "exp-1",  item: "Mortgage",                       due_date: "2025-01-01", amount: 3611.32, pay_period: "owe 560k" },
    { id: "exp-2",  item: "Rent partial payment",           due_date: "2025-01-01", amount: 840,     pay_period: "until July" },
    { id: "exp-3",  item: "V: American Express CC",         due_date: "2025-01-01", amount: 100,     pay_period: "Credit Card" },
    { id: "exp-4",  item: "K: Capital One Quick Silver",    due_date: "2025-01-05", amount: 25,      pay_period: "Credit Card" },
    { id: "exp-5",  item: "V: Best Buy",                    due_date: "2025-01-07", amount: 100,     pay_period: "Credit Card" },
    { id: "exp-6",  item: "K: Capital One Savor",           due_date: "2025-01-08", amount: 80,      pay_period: "Credit Card" },
    { id: "exp-7",  item: "V: Citi Bank Diamond Preferred", due_date: "2025-01-08", amount: 300,     pay_period: "Credit Card" },
    { id: "exp-8",  item: "V: Student Loans",               due_date: "2025-01-09", amount: 50,      pay_period: "owe 2200" },
    { id: "exp-9",  item: "V: Chase",                       due_date: "2025-01-12", amount: 200,     pay_period: "Credit Card" },
    { id: "exp-10", item: "K: Citi Bank Double Cash",       due_date: "2025-01-13", amount: 897.47,  pay_period: "Credit Card" },
    { id: "exp-11", item: "V: USAA Rate Advantage",         due_date: "2025-01-13", amount: 300,     pay_period: "Credit Card" },
    { id: "exp-12", item: "V: IKEA",                        due_date: "2025-01-13", amount: 0,       pay_period: "Credit Card" },
    { id: "exp-13", item: "V: Victoria Secret",             due_date: "2025-01-13", amount: 0,       pay_period: "Credit Card" },
    { id: "exp-14", item: "K: Car Note",                    due_date: "2025-01-15", amount: 427,     pay_period: "owe 19k" },
    { id: "exp-15", item: "V: Car Note",                    due_date: "2025-01-26", amount: 805,     pay_period: "owe 49k" },
    { id: "exp-16", item: "V: Apple CC",                    due_date: "2025-01-20", amount: 200,     pay_period: "Credit Card" },
    { id: "exp-17", item: "V: A+ Federal Credit Union",     due_date: "2025-01-22", amount: 160,     pay_period: "Credit Card" },
    { id: "exp-18", item: "K: Apple CC",                    due_date: "2025-01-24", amount: 80,      pay_period: "Credit Card" },
    { id: "exp-19", item: "K: USAA Rate Advantage",         due_date: "2025-01-28", amount: 50,      pay_period: "Credit Card" },
    { id: "exp-20", item: "K: Capital One Platinum",        due_date: "2025-01-19", amount: 50,      pay_period: "Credit Card" },
    { id: "exp-21", item: "V: CB2",                         due_date: "2025-01-22", amount: 50,      pay_period: "Credit Card" },
    { id: "exp-22", item: "IRS",                            due_date: "",            amount: 0,       pay_period: "Owe IRS 20k" },
    { id: "exp-23", item: "T-Mobile",                       due_date: "2025-01-24", amount: 265,     pay_period: "MS" },
    { id: "exp-24", item: "Car insurance (Progressive)",    due_date: "2025-01-16", amount: 156,     pay_period: "MS" },
  ],

  // One row per account. `contribution_days` is free text — list however
  // many monthly auto-deduction days are scheduled (e.g. "5/7, 5/22").
  savings: [
    { id: "sav-1", item: "USAA Savings", contribution_days: "5/7, 5/22", amount: 0, saved: 0, goal: 5000  },
    { id: "sav-2", item: "LT Schwab",    contribution_days: "5/7, 5/22", amount: 0, saved: 0, goal: 10000 },
    { id: "sav-3", item: "DT Account",   contribution_days: "5/7, 5/22", amount: 0, saved: 0, goal: 3000  },
  ],

  cc_utilization: [
    { id: "k-1", owner: "kyle", name: "K: Capital One Quick Silver",    date: "2025-01-05", balance: 487,   credit_limit: 500   },
    { id: "k-2", owner: "kyle", name: "K: Capital One Savor",           date: "2025-01-08", balance: 1377,  credit_limit: 1500  },
    { id: "k-3", owner: "kyle", name: "K: Apple CC",                    date: "2025-01-24", balance: 2810,  credit_limit: 3000  },
    { id: "k-4", owner: "kyle", name: "K: Citi Bank Double Cash",       date: "2025-01-13", balance: 11638, credit_limit: 11500 },
    { id: "k-5", owner: "kyle", name: "K: USAA Rate Advantage",         date: "2025-01-28", balance: 979,   credit_limit: 1000  },
    { id: "k-6", owner: "kyle", name: "K: Capital One Platinum",        date: "2025-01-19", balance: 1300,  credit_limit: 2000  },
    { id: "k-7", owner: "kyle", name: "V: USAA Rate Advantage",         date: "2025-01-13", balance: 14246, credit_limit: 15000 },
    { id: "k-8", owner: "kyle", name: "V: Citi Bank Diamond Preferred", date: "2025-01-08", balance: 13314, credit_limit: 14000 },
    { id: "k-9", owner: "kyle", name: "V: American Express CC",         date: "2025-01-01", balance: 2800,  credit_limit: 4000  },
    { id: "k-10",owner: "kyle", name: "V: CB2",                         date: "2025-01-22", balance: 2140,  credit_limit: 5000  },
    { id: "k-11",owner: "kyle", name: "V: A+ Federal Credit Union",     date: "2025-01-22", balance: 7340,  credit_limit: 19500 },
    { id: "k-12",owner: "kyle", name: "V: Victoria Secret",             date: "2025-01-13", balance: 0,     credit_limit: 2650  },
    { id: "k-13",owner: "kyle", name: "V: Chase",                       date: "2025-01-12", balance: 8330,  credit_limit: 18000 },
    { id: "k-14",owner: "kyle", name: "V: Best Buy",                    date: "2025-01-07", balance: 630,   credit_limit: 15000 },
    { id: "k-15",owner: "kyle", name: "V: IKEA",                        date: "2025-01-13", balance: 0,     credit_limit: 8950  },
    { id: "v-1", owner: "visha",name: "V: USAA Rate Advantage",         date: "2025-01-13", balance: 14000, credit_limit: 15000 },
    { id: "v-2", owner: "visha",name: "V: Citi Bank Diamond Preferred", date: "2025-01-08", balance: 12990, credit_limit: 14000 },
    { id: "v-3", owner: "visha",name: "V: American Express CC",         date: "2025-01-01", balance: 2800,  credit_limit: 4000  },
    { id: "v-4", owner: "visha",name: "V: Chase",                       date: "2025-01-12", balance: 8330,  credit_limit: 18000 },
    { id: "v-5", owner: "visha",name: "V: Best Buy",                    date: "2025-01-07", balance: 1923,  credit_limit: 15000 },
    { id: "v-6", owner: "visha",name: "V: IKEA",                        date: "2025-01-13", balance: 0,     credit_limit: 8950  },
    { id: "v-7", owner: "visha",name: "V: CB2",                         date: "2025-01-22", balance: 2140,  credit_limit: 5000  },
    { id: "v-8", owner: "visha",name: "V: Victoria Secret",             date: "2025-01-13", balance: 0,     credit_limit: 2650  },
    { id: "v-9", owner: "visha",name: "V: Apple CC",                    date: "2025-01-20", balance: 0,     credit_limit: 6000  },
    { id: "v-10",owner: "visha",name: "V: A+ Federal Credit Union",     date: "2025-01-22", balance: 7340,  credit_limit: 19500 },
  ],

  cc_expenses: [
    { id: "cce-1",  card: "Capital One",      item: "Amazon",                 due_date: "2025-01-30", amount: 17,    pay_period: "MS - CC" },
    { id: "cce-2",  card: "Capital One",      item: "Amazon - HIDIVE",        due_date: "2025-01-14", amount: 0,     pay_period: "MS - CC" },
    { id: "cce-3",  card: "Apple",            item: "IXL - Boys Learning",    due_date: "2025-01-08", amount: 0,     pay_period: "MS - CC" },
    { id: "cce-4",  card: "Apple",            item: "Chat GPT",               due_date: "2025-01-10", amount: 0,     pay_period: "MS - CC" },
    { id: "cce-5",  card: "Apple",            item: "NFL+",                   due_date: "2025-01-15", amount: 0,     pay_period: "MS - CC" },
    { id: "cce-6",  card: "Apple",            item: "Gym Pass",               due_date: "2025-01-17", amount: 0,     pay_period: "MS - CC" },
    { id: "cce-7",  card: "Apple",            item: "Identity IQ",            due_date: "2025-01-20", amount: 0,     pay_period: "credit monitoring" },
    { id: "cce-8",  card: "Apple",            item: "Crunchy Roll",           due_date: "2025-01-23", amount: 12.94, pay_period: "MS - CC" },
    { id: "cce-9",  card: "Apple",            item: "Apple One (MS)",         due_date: "2025-01-26", amount: 40.61, pay_period: "MS - CC" },
    { id: "cce-10", card: "Apple",            item: "HIDIVE",                 due_date: "",            amount: 0,     pay_period: "MS - CC" },
    { id: "cce-11", card: "Citi Bank",        item: "KJ & Kacey School Meals",due_date: "2025-01-01", amount: 80,    pay_period: "MS - CC" },
    { id: "cce-12", card: "Citi Bank",        item: "Disney Plus & Hulu",     due_date: "2025-01-01", amount: 24,    pay_period: "MS - CC" },
    { id: "cce-13", card: "Citi Bank",        item: "Hair Cuts",              due_date: "2025-01-01", amount: 140,   pay_period: "MS - CC" },
    { id: "cce-14", card: "Citi Bank",        item: "After Pay",              due_date: "2025-01-01", amount: 0,     pay_period: "MS - CC" },
    { id: "cce-15", card: "Citi Bank",        item: "Pest Control",           due_date: "2025-01-06", amount: 53,    pay_period: "MS - CC" },
    { id: "cce-16", card: "Citi Bank",        item: "PEC Electric",           due_date: "2025-01-23", amount: 200,   pay_period: "MS - CC" },
    { id: "cce-17", card: "Citi Bank",        item: "T-Mobile",               due_date: "2025-01-24", amount: 0,     pay_period: "MS - CC" },
    { id: "cce-18", card: "Citi Bank",        item: "GVTC",                   due_date: "2025-01-25", amount: 71.96, pay_period: "MS - CC" },
    { id: "cce-19", card: "Citi Bank",        item: "Alliant Gas",            due_date: "2025-01-26", amount: 100,   pay_period: "MS - CC" },
    { id: "cce-20", card: "Citi Bank",        item: "Garbage & Recycling",    due_date: "2025-01-29", amount: 28.51, pay_period: "E3M" },
    { id: "cce-21", card: "Citi Bank",        item: "Amazon",                 due_date: "2025-01-30", amount: 0,     pay_period: "MS - CC" },
    { id: "cce-22", card: "Citi Bank",        item: "Canyon Lake Water",      due_date: "2025-01-31", amount: 200,   pay_period: "MS - CC" },
    { id: "cce-23", card: "Citi Bank",        item: "HOA",                    due_date: "2025-01-01", amount: 0,     pay_period: "Yearly 660" },
    { id: "cce-24", card: "Chase",            item: "Groceries",              due_date: "2025-01-01", amount: 200,   pay_period: "MS" },
    { id: "cce-25", card: "Capital One SAVOR",item: "Ring Alarm",             due_date: "2025-01-19", amount: 5.40,  pay_period: "MS - CC" },
    { id: "cce-26", card: "American Express", item: "",                       due_date: "",            amount: 0,     pay_period: "" },
  ],
};

function seed() {
  migrate(DB_PATH);
  const db = new Database(DB_PATH);

  const count = db.prepare("SELECT COUNT(*) AS n FROM income").get().n;
  if (count > 0 && !FORCE) {
    console.log(`Already seeded (income has ${count} rows). Re-run with --force to wipe and re-seed.`);
    db.close();
    return;
  }

  const wipeAndInsert = db.transaction(() => {
    if (FORCE) {
      db.exec(`DELETE FROM income; DELETE FROM expenses; DELETE FROM savings;
               DELETE FROM cc_utilization; DELETE FROM cc_expenses;`);
    }

    db.prepare(`UPDATE meta SET household_name = ? WHERE id = 1`).run(SEED.meta.household_name);

    const insertInto = (table, cols) => db.prepare(
      `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`
    );

    const incIns = insertInto("income",         ["id", "item", "amount"]);
    const expIns = insertInto("expenses",       ["id", "item", "due_date", "amount", "pay_period"]);
    const savIns = insertInto("savings",        ["id", "item", "contribution_days", "amount", "saved", "goal"]);
    const ccuIns = insertInto("cc_utilization", ["id", "owner", "name", "date", "balance", "credit_limit"]);
    const cceIns = insertInto("cc_expenses",    ["id", "card", "item", "due_date", "amount", "pay_period"]);

    SEED.income.forEach(r => incIns.run(r.id, r.item, r.amount));
    SEED.expenses.forEach(r => expIns.run(r.id, r.item, r.due_date, r.amount, r.pay_period));
    SEED.savings.forEach(r => savIns.run(r.id, r.item, r.contribution_days, r.amount, r.saved, r.goal));
    SEED.cc_utilization.forEach(r => ccuIns.run(r.id, r.owner, r.name, r.date, r.balance, r.credit_limit));
    SEED.cc_expenses.forEach(r => cceIns.run(r.id, r.card, r.item, r.due_date, r.amount, r.pay_period));
  });

  wipeAndInsert();
  db.close();

  const counts = {
    income:         SEED.income.length,
    expenses:       SEED.expenses.length,
    savings:        SEED.savings.length,
    cc_utilization: SEED.cc_utilization.length,
    cc_expenses:    SEED.cc_expenses.length,
  };
  console.log("Seeded:", counts);
}

if (require.main === module) seed();

module.exports = { seed };
