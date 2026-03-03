// Gemini function calling tool definitions
export const AI_TOOLS = [
  {
    name: "get_portfolio_balances",
    description:
      "Get all token balances for the user's wallet including BTC tokens, stablecoins, ETH, and STRK. Shows USD values.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_staking_pools",
    description:
      "Get all available STRK staking pools with validator names, APRs, commission rates, and pool addresses.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_staking_position",
    description:
      "Get the user's current staking position in a specific validator pool.",
    parameters: {
      type: "object",
      properties: {
        pool_address: {
          type: "string",
          description: "The pool contract address to check position for.",
        },
      },
      required: ["pool_address"],
    },
  },
  {
    name: "get_all_positions",
    description:
      "Get the user's staking positions across all validators where they have staked.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "stake_tokens",
    description:
      "Stake STRK tokens in a validator pool. Automatically handles first-time entry or adding to existing position. ALWAYS ask for user confirmation before executing.",
    parameters: {
      type: "object",
      properties: {
        pool_address: {
          type: "string",
          description: "The pool contract address to stake in.",
        },
        amount: {
          type: "string",
          description: "Amount of STRK to stake (e.g. '100' for 100 STRK).",
        },
      },
      required: ["pool_address", "amount"],
    },
  },
  {
    name: "claim_rewards",
    description:
      "Claim accumulated staking rewards from a specific pool. ALWAYS ask for confirmation before executing.",
    parameters: {
      type: "object",
      properties: {
        pool_address: {
          type: "string",
          description: "The pool address to claim rewards from.",
        },
      },
      required: ["pool_address"],
    },
  },
  {
    name: "claim_all_rewards",
    description:
      "Claim all accumulated staking rewards across every active position. ALWAYS ask for confirmation before executing.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "transfer_tokens",
    description:
      "Send tokens to another address (gasless via AVNU Paymaster). ALWAYS ask for confirmation before executing.",
    parameters: {
      type: "object",
      properties: {
        token_symbol: {
          type: "string",
          description: "Token symbol to transfer (e.g. 'STRK', 'USDC', 'ETH').",
        },
        amount: {
          type: "string",
          description: "Amount to transfer.",
        },
        recipient: {
          type: "string",
          description: "Recipient wallet address (0x...).",
        },
      },
      required: ["token_symbol", "amount", "recipient"],
    },
  },
  {
    name: "recommend_best_yield",
    description:
      "Analyze all staking pools and recommend the best yield strategy based on APR, commission, and validator reputation.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "exit_staking_pool",
    description:
      "Begin the exit process from a staking pool. This starts the 21-day cooldown period. ALWAYS ask for confirmation before executing.",
    parameters: {
      type: "object",
      properties: {
        pool_address: {
          type: "string",
          description: "The pool address to exit from.",
        },
        amount: {
          type: "string",
          description: "Amount of STRK to unstake.",
        },
      },
      required: ["pool_address", "amount"],
    },
  },
];
