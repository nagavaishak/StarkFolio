# StarkFolio

**Your AI portfolio manager for Bitcoin yield on Starknet.**

StarkFolio lets anyone manage Bitcoin and crypto assets on Starknet through natural language — no crypto knowledge required. Just sign in with your email or Google and start talking to your AI portfolio manager.

> Built for the [Starkzap Developer Challenge](https://starkzap.dev) · $3,000 prize pool · Due March 10, 2026

---

## What It Does

- **"What's in my portfolio?"** → Shows all token balances with USD values
- **"Where should I stake my STRK?"** → Compares all validator APRs, picks the best
- **"Stake 100 STRK with Karnot"** → Executes the stake, gasless, no ETH needed
- **"Claim all my rewards"** → Batches claims across all active positions
- **"Send 50 USDC to 0x..."** → Transfers tokens, also gasless

Everything is gasless via AVNU Paymaster. No seed phrases. No wallet extensions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Blockchain SDK | `starkzap` |
| Wallet Auth | Privy (email, Google, Apple) |
| Paymaster | AVNU Paymaster (gasless) |
| AI Agent | Google Gemini Flash (function calling) |
| Styling | Tailwind CSS 4 |
| Network | Starknet Sepolia |
| Deploy | Vercel |

### Starkzap SDK Modules Used
- **Wallets** — Privy social login → Starknet embedded wallet
- **ERC20** — Token balance fetching for BTC, STRK, ETH, stablecoins
- **Staking** — Full lifecycle: enter, add, claim, exit-intent, exit
- **Transaction Builder** — Batched atomic operations (claim-all + restake)
- **AVNU Paymaster** — Every transaction is gasless (`feeMode: "sponsored"`)

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### 1. Clone and install

```bash
git clone https://github.com/nagavaishak/StarkFolio.git
cd StarkFolio
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Privy — create app at https://dashboard.privy.io
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
PRIVY_APP_SECRET=your-privy-secret

# Google Gemini Flash — free tier at https://aistudio.google.com/apikey
GOOGLE_AI_API_KEY=your-gemini-api-key

# Starknet (already set)
NEXT_PUBLIC_STARKNET_NETWORK=sepolia
```

### 3. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture

```
┌────────────────────────────────────────────┐
│              Next.js Frontend               │
│                                             │
│  Login Page  │  Dashboard  │  AI Chat      │
│  (Privy)     │  (Portfolio │  (Gemini      │
│              │  + Staking) │   Flash)      │
└──────────────────────┬─────────────────────┘
                       │
┌──────────────────────▼─────────────────────┐
│           Next.js API Routes                │
│                                             │
│  /api/chat      → Gemini + tool execution  │
│  /api/wallet    → Privy wallet proxy       │
│  /api/wallet/sign → Privy signing proxy    │
└──────────────────────┬─────────────────────┘
                       │
┌──────────────────────▼─────────────────────┐
│              Starkzap SDK                   │
│                                             │
│  WalletInterface · ERC20 · Staking         │
│  Transaction Builder · AVNU Paymaster      │
└──────────────────────┬─────────────────────┘
                       │
┌──────────────────────▼─────────────────────┐
│           Starknet Blockchain               │
│  STRK Staking · BTC Tokens · Stablecoins  │
└────────────────────────────────────────────┘
```

---

## AI Capabilities

The Gemini Flash agent has 10 tools:

| Tool | Description |
|------|-------------|
| `get_portfolio_balances` | All token balances + USD values |
| `get_staking_pools` | All validators with APR + commission |
| `get_staking_position` | Position in a specific pool |
| `get_all_positions` | All active staking positions |
| `stake_tokens` | Smart stake (auto enter or add) |
| `claim_rewards` | Claim from specific pool |
| `claim_all_rewards` | Batch claim all positions |
| `transfer_tokens` | Send tokens to any address |
| `recommend_best_yield` | AI analysis of best strategy |
| `exit_staking_pool` | Begin 21-day exit cooldown |

All fund-moving operations require explicit user confirmation before execution.

---

## Key Features

### Gasless Everything
Every transaction uses AVNU Paymaster with `feeMode: "sponsored"`. Users never need to hold ETH for gas.

### BTCFi Focus
Native support for all Starknet BTC tokens: WBTC, LBTC, SolvBTC, tBTC. Dedicated BTC yield tracking.

### Batched Transactions
Uses Starkzap Transaction Builder for atomic multi-operation batches — e.g., claim all rewards + restake in a single transaction.

### No Crypto Knowledge Required
Privy handles wallet creation invisibly. Users sign in with email or Google and get a Starknet wallet automatically.

---

## Demo

Live: [starkfolio.vercel.app](https://starkfolio.vercel.app)

---

## License

MIT
