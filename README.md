# StarkFolio — AI Bitcoin Yield Agent on Starknet

**Your AI portfolio manager for Bitcoin yield on Starknet.**

StarkFolio lets anyone manage Bitcoin and crypto assets on Starknet through natural language — no crypto knowledge required. Sign in with email, and your AI manager stakes, claims rewards, and optimizes yield automatically.

> Built for the [Starkzap Developer Challenge](https://github.com/keep-starknet-strange/starkzap) · $3,000 prize pool · Deadline Mar 10 2026

**Live demo:** https://starkfolio-umber.vercel.app

---

## What It Does

| Say this | StarkFolio does this |
|----------|---------------------|
| "What's in my portfolio?" | Reads live on-chain balances via StarkZap ERC20 |
| "Where should I stake my STRK?" | Compares all 5 validators by APR + commission |
| "Stake 100 STRK with Nethermind" | Executes gasless stake, returns Voyager link |
| "Claim all my rewards" | Batches all pool claims into **one atomic tx** via Transaction Builder |
| "Send 10 USDC to 0x…" | Gasless transfer, no ETH needed |
| "Exit my Chorus One position" | Initiates 21-day unbonding cooldown |

Everything is **gasless** via AVNU Paymaster. No seed phrases. No wallet extensions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Blockchain SDK | **StarkZap** v1.0 — all 4 modules |
| Wallet Auth | Privy v3 (embedded Starknet wallet) |
| Paymaster | AVNU Paymaster (`feeMode: "sponsored"`) |
| AI | Gemini 2.5 Flash (function calling, 10 tools) |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |
| Network | Starknet Sepolia testnet |

---

## StarkZap SDK — All 4 Modules

### 1. Wallets — Privy embedded wallet, no seed phrases
```typescript
import { StarkZap, OnboardStrategy } from "starkzap";

const sdk = new StarkZap({ network: "sepolia" });
const { wallet } = await sdk.onboard({
  strategy: OnboardStrategy.Privy,
  deploy: "if_needed",          // auto-deploys wallet on first tx
  privy: {
    resolve: async () => ({
      walletId,
      publicKey,
      serverUrl: `${appUrl}/api/wallet/sign`,
      headers: { Authorization: `Bearer ${authToken}` },
    }),
  },
});
```

### 2. Staking — full lifecycle (enter → claim → exit)
```typescript
import { Amount, sepoliaTokens, fromAddress } from "starkzap";

// Smart stake: auto-detects enter vs add based on membership
const tx = await wallet.stake(
  fromAddress(poolAddress),
  Amount.parse("100", sepoliaTokens.STRK)
);
await tx.wait();

// Claim rewards from a specific pool
const tx = await wallet.claimPoolRewards(fromAddress(poolAddress));

// Begin exit (starts 21-day cooldown)
const tx = await wallet.exitPoolIntent(
  fromAddress(poolAddress),
  Amount.parse("50", sepoliaTokens.STRK)
);
```

### 3. Transaction Builder — batch claim ALL pools atomically
```typescript
// One tx claims rewards from all 5 validators at once
// Atomic: either all pools claim or none do
let builder = wallet.tx();
for (const poolAddress of allPoolAddresses) {
  builder = builder.claimPoolRewards(fromAddress(poolAddress));
}
const tx = await builder.send({ feeMode: "sponsored" });
await tx.wait();
// Result: 5 claim operations in 1 transaction
```

### 4. AVNU Paymaster — gasless for every operation
```typescript
// All operations use sponsored fee mode — users pay $0 gas
const tx = await wallet.stake(poolAddress, amount);   // gasless
const tx = await wallet.claimPoolRewards(poolAddress); // gasless
const tx = await builder.send({ feeMode: "sponsored" }); // gasless batch
```

---

## AI Agent — 10 Function-Calling Tools

Gemini 2.5 Flash bridges natural language → StarkZap SDK calls:

| Tool | What it calls |
|------|--------------|
| `get_portfolio_balances` | `wallet.balanceOf()` for STRK, ETH, USDC, WBTC… |
| `get_staking_pools` | `sepoliaValidators` + live pool data |
| `get_all_positions` | `wallet.getPoolPosition()` across all validators |
| `recommend_best_yield` | APR + commission analysis across pools |
| `stake_tokens` | `wallet.stake()` via `/api/execute` |
| `claim_rewards` | `wallet.claimPoolRewards()` |
| `claim_all_rewards` | `wallet.tx().claimPoolRewards()×N` (Transaction Builder) |
| `transfer_tokens` | `wallet.transfer()` |
| `exit_staking_pool` | `wallet.exitPoolIntent()` |
| `get_staking_position` | `wallet.getPoolPosition()` for one pool |

All fund-moving tools require explicit user confirmation before executing.

---

## Architecture

```
Browser (Next.js)
  └─ Privy embedded wallet (self-custodial, no seed phrase)
       └─ WalletContext → dashboard + AI chat

/api/chat   Gemini 2.5 Flash + 10 function-calling tools
  └─ Read tools  → /api/starkzap  (server-side StarkZap reads)
  └─ Write tools → /api/execute   (sign via /api/wallet/sign)

/api/execute
  └─ Verify Privy auth token
  └─ Onboard StarkZap wallet (Privy strategy)
  └─ Execute: stake / claim / batch-claim / transfer / exit
  └─ Return tx.hash + tx.explorerUrl

/api/wallet/sign  (Privy signing proxy)
  └─ StarkZap calls this to sign transactions
  └─ Forwards to Privy server-side API
  └─ Private key never leaves Privy custody
```

---

## Running Locally

```bash
git clone https://github.com/nagavaishak/StarkFolio.git
cd StarkFolio
pnpm install
cp .env.example .env.local
# fill in .env.local
pnpm dev
```

Open http://localhost:3000

### Environment Variables

```bash
# Privy — create app at dashboard.privy.io
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
PRIVY_APP_SECRET=your-privy-app-secret

# Google AI — get key at aistudio.google.com
GOOGLE_AI_API_KEY=your-gemini-api-key

# Starknet
NEXT_PUBLIC_STARKNET_NETWORK=sepolia
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.voyager.online
```

---

## Staking Validators (Sepolia)

| Validator | APR | Commission |
|-----------|-----|-----------|
| Nethermind | 8.6% | 6% |
| Chorus One | 8.2% | 7% |
| Cumulo | 8.0% | 8% |
| Teku | 7.9% | 8% |
| Moonli.me | 7.7% | 10% |

---

## GitHub Issues Filed on starkzap

- [#56](https://github.com/keep-starknet-strange/starkzap/issues/56) — Privy integration: `serverUrl` and `headers` not in quick start docs
- [#57](https://github.com/keep-starknet-strange/starkzap/issues/57) — `@cartridge/controller` static import breaks Next.js — should be optional
- [#58](https://github.com/keep-starknet-strange/starkzap/issues/58) — Read-only wallet pattern: `{ address }` as `WalletInterface` for server-side queries

---

## awesome-starkzap

Listed in [awesome-starkzap](https://github.com/keep-starknet-strange/awesome-starkzap) via [PR #18](https://github.com/keep-starknet-strange/awesome-starkzap/pull/18).

---

## License

MIT
