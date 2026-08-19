# Polymarket Trading Bots — Notes

## Honest read first
This section is in the kit for completeness, but it's the highest-skill, highest-capital path of anything documented. Do NOT use this as your starting system. Build YouTube and the agent team first. This is what to look at after you have revenue and time.

## What's documented
Between April 2024 and April 2025, quantitative traders extracted $39,688,585 in arbitrage from Polymarket. Top single trader: $2,009,631 from 4,049 trades ($496 guaranteed profit per trade average).

This is NOT prediction. This is math identifying situations where one outcome pays $1 and you can buy it for less.

## The 6 strategy types

1. **Pure Arbitrage Bot** — buys both YES and NO when combined price < $1. Guaranteed profit. Hard part is detecting + executing before spread closes.
2. **Directional Arbitrage Bot** — starts with arb structure, tilts toward the side it thinks is undervalued. Arb as protective frame for directional bet.
3. **Repricing / Fair Value Model Bot** — builds own estimate of fair price from underlying asset (e.g., BTC price), buys when Polymarket lags.
4. **Cross-Timeframe / Multi-Market Bot** — trades 5-min and 15-min contracts simultaneously, exploits lag between related markets.
5. **Order Book Imbalance Bot** — builds positions in parts when seeing skew in the book.
6. **Near-Resolution Bot** — buys almost-resolved outcomes trading at $0.98–$0.99 instead of $1. High win rate, real tail risk.

## The common DNA of profitable bots

1. **Limit orders only** — market orders destroy thin-edge strategies via slippage
2. **Small repeatable edge** — 1–5% per trade, repeated hundreds of times
3. **Trade structure, not direction** — ask "where is price wrong?" not "will it go up?"
4. **Exploit inefficiencies** — the lag between underlying price and Polymarket price
5. **Manage risk through position structure** — hedge with the other side

## What you actually need to compete

**Infrastructure (the table stakes):**
- Real-time WebSocket connection to Polymarket CLOB
- Alchemy Polygon node for on-chain events
- Integer programming solver (Gurobi or equivalent)
- Same-block execution capability
- Kelly criterion position sizing accounting for order book depth

**Capital:** Realistic minimum to overcome fees + slippage + occasional bad fills: $5K–$10K. Documented top performers running $100K+ books.

**Why copy-trading "fast wallets" doesn't work:**
- Block N-1: pro system detects, submits in 30ms
- Block N: all legs confirm, arb captured
- Block N+1: you see it on chain, copy
- You paid $0.344 for what they bought at $0.322 — you're providing exit liquidity, not arbitraging

## Honest conclusion
The $40M extraction is real and the algorithms are public (arXiv:2508.03474). But this is a multi-month engineering project requiring serious capital. Most people reading "Claude built me a trading bot that made $193K" are reading marketing for someone else's bot service.

If you want exposure to prediction markets without building infrastructure: trade manually with small positions on obvious mispricings. Don't compete with the bots — eat the scraps they leave.
