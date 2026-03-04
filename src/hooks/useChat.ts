"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, ToolCall } from "@/types/chat";
import { MOCK_VALIDATOR_APRS } from "@/lib/starkzap/tokens";

function generateId(): string {
  return Math.random().toString(36).slice(2);
}

// Tool executor: bridges AI tool calls to mock StarkZap operations
async function executeToolCall(
  toolName: string,
  toolArgs: Record<string, unknown>,
  walletAddress: string | null
): Promise<unknown> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  switch (toolName) {
    case "get_portfolio_balances": {
      if (!walletAddress) return { error: "Wallet not connected. Please sign in first." };
      try {
        // Fetch real on-chain balances via StarkZap SDK
        const res = await fetch(`/api/starkzap?address=${encodeURIComponent(walletAddress)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.live && data.balances?.length > 0) {
            const PRICES: Record<string, number> = { STRK: 0.38, ETH: 3200, USDC: 1.0, WBTC: 96000 };
            const balances = data.balances.map((b: { symbol: string; balance: string; formatted: string }) => ({
              symbol: b.symbol,
              balance: b.balance,
              formatted: b.formatted,
              usdValue: (parseFloat(b.balance) * (PRICES[b.symbol] ?? 0)).toFixed(2),
            }));
            const totalUsd = balances.reduce((s: number, b: { usdValue: string }) => s + parseFloat(b.usdValue), 0);
            return { address: walletAddress, balances, totalUsdValue: totalUsd.toFixed(2), source: "live_chain" };
          }
        }
      } catch { /* fall through to demo */ }
      // Demo fallback
      const seed = parseInt(walletAddress.slice(2, 8) || "deadbe", 16) % 100;
      return {
        address: walletAddress,
        balances: [
          { symbol: "STRK", balance: (150 + seed * 2.3).toFixed(2), usdValue: ((150 + seed * 2.3) * 0.38).toFixed(2) },
          { symbol: "ETH", balance: (0.05 + seed * 0.001).toFixed(4), usdValue: ((0.05 + seed * 0.001) * 3200).toFixed(2) },
          { symbol: "USDC", balance: (250 + seed * 5).toFixed(2), usdValue: (250 + seed * 5).toFixed(2) },
          { symbol: "WBTC", balance: (0.001 + seed * 0.00001).toFixed(8), usdValue: ((0.001 + seed * 0.00001) * 96000).toFixed(2) },
        ],
        totalUsdValue: ((150 + seed * 2.3) * 0.38 + (0.05 + seed * 0.001) * 3200 + (250 + seed * 5) + (0.001 + seed * 0.00001) * 96000).toFixed(2),
        source: "demo",
      };
    }

    case "get_staking_pools": {
      return {
        pools: Object.entries(MOCK_VALIDATOR_APRS).map(([name, apr], i) => ({
          validator: name,
          apr: `${apr}%`,
          commission: `${[10, 5, 8, 7, 6][i]}%`,
          totalDelegated: `${(1_000_000 + i * 250_000).toLocaleString()} STRK`,
          poolAddress: `0x0${(i + 1).toString().padStart(63, "0")}`,
        })),
      };
    }

    case "recommend_best_yield": {
      const sorted = Object.entries(MOCK_VALIDATOR_APRS).sort(([, a], [, b]) => b - a);
      return {
        recommendation: sorted[0][0],
        apr: `${sorted[0][1]}%`,
        reasoning: `Nethermind currently offers the highest APR at ${sorted[0][1]}% with a 6% commission. For risk diversification, consider splitting between Nethermind and Karnot.`,
        comparison: sorted.map(([name, apr]) => ({ validator: name, apr: `${apr}%` })),
      };
    }

    case "get_all_positions": {
      if (!walletAddress) return { error: "Wallet not connected." };
      try {
        const res = await fetch(`/api/starkzap?address=${encodeURIComponent(walletAddress)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.live && data.positions !== undefined) {
            if (data.positions.length === 0) return { positions: [], message: "No active staking positions found on Sepolia." };
            return { positions: data.positions, source: "live_chain" };
          }
        }
      } catch { /* fall through */ }
      const seed = parseInt(walletAddress.slice(2, 8) || "abc123", 16) % 100;
      if (seed < 30) return { positions: [], message: "No active staking positions found." };
      return {
        positions: [
          {
            validator: "Nethermind",
            staked: `${(100 + seed * 1.5).toFixed(2)} STRK`,
            rewards: `${(seed * 0.12).toFixed(4)} STRK`,
            apr: "8.6%",
            commissionPercent: "6%",
          },
        ],
        source: "demo",
      };
    }

    case "stake_tokens": {
      const { pool_address, amount } = toolArgs as { pool_address: string; amount: string };
      return {
        status: "pending_confirmation",
        summary: `Stake ${amount} STRK in pool ${pool_address.slice(0, 8)}...`,
        txHash: null,
        note: "Transaction will be gasless via AVNU Paymaster.",
      };
    }

    case "claim_rewards": {
      const { pool_address } = toolArgs as { pool_address: string };
      return {
        status: "simulated",
        pool: pool_address.slice(0, 8) + "...",
        rewardsClaimed: "12.4823 STRK",
        txHash: "0xdemo" + Math.random().toString(16).slice(2, 12),
        explorerUrl: `${process.env.NEXT_PUBLIC_EXPLORER_URL || "https://sepolia.voyager.online"}/tx/0xdemo`,
        note: "Gasless transaction — no ETH needed.",
      };
    }

    case "claim_all_rewards": {
      return {
        status: "simulated",
        totalClaimed: "18.7241 STRK",
        pools: ["Karnot", "Argent"],
        txHash: "0xdemo" + Math.random().toString(16).slice(2, 12),
        note: "Batched claim via Transaction Builder. Gasless.",
      };
    }

    case "transfer_tokens": {
      const { token_symbol, amount, recipient } = toolArgs as { token_symbol: string; amount: string; recipient: string };
      return {
        status: "simulated",
        token: token_symbol,
        amount,
        recipient: recipient.slice(0, 8) + "..." + recipient.slice(-6),
        txHash: "0xdemo" + Math.random().toString(16).slice(2, 12),
        note: "Gasless transfer via AVNU Paymaster.",
      };
    }

    case "exit_staking_pool": {
      const { pool_address, amount } = toolArgs as { pool_address: string; amount: string };
      const cooldownEnd = new Date();
      cooldownEnd.setDate(cooldownEnd.getDate() + 21);
      return {
        status: "simulated",
        pool: pool_address.slice(0, 8) + "...",
        amount: `${amount} STRK`,
        cooldownEnds: cooldownEnd.toLocaleDateString(),
        note: "21-day cooldown period has started. You can complete the withdrawal after this date.",
      };
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

export function useChat(walletAddress: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm StarkFolio AI — your portfolio manager for Bitcoin yield on Starknet.\n\nI can help you:\n• Check your portfolio balances\n• Find the best staking yield\n• Stake STRK, claim rewards, transfer tokens\n• All transactions are gasless via AVNU\n\nWhat would you like to do?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Abort any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const historyForApi = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: historyForApi,
            walletAddress,
          }),
          signal: abortRef.current.signal,
        });

        if (res.status === 429) {
          const errData = await res.json();
          const errorMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: errData.error || "Rate limit hit — please wait a moment and try again.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMsg]);
          setIsLoading(false);
          return;
        }
        if (!res.ok) throw new Error("Chat API error");

        const data = await res.json();

        if (data.type === "tool_call") {
          // Execute tool and stream result back
          const toolResult = await executeToolCall(data.toolName, data.toolArgs, walletAddress);

          const toolCall: ToolCall = {
            name: data.toolName,
            args: data.toolArgs,
            result: toolResult,
          };

          // Get AI's interpretation of the tool result
          const followUpRes = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                ...historyForApi,
                {
                  role: "assistant",
                  content: `I called ${data.toolName} and got this result: ${JSON.stringify(toolResult, null, 2)}. Now I'll explain this to the user clearly.`,
                },
              ],
              walletAddress,
            }),
          });

          const followUpData = await followUpRes.json();

          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: followUpData.text || JSON.stringify(toolResult, null, 2),
            toolCalls: [toolCall],
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMsg]);
        } else {
          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: data.text,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
      } catch (e: unknown) {
        if ((e as Error).name === "AbortError") return;
        const errorMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: "Sorry, I ran into an error. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, walletAddress]
  );

  return { messages, isLoading, sendMessage };
}
