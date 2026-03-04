"use client";

import { useState, useEffect, useCallback } from "react";
import { Portfolio, TokenBalance } from "@/types/portfolio";
import { MOCK_PRICES, BTC_TOKENS, TOKEN_LOGOS } from "@/lib/starkzap/tokens";

// Demo fallback — shown when wallet has zero on-chain balances
function getDemoPortfolio(address: string): Portfolio & { isDemo: boolean } {
  const seed = parseInt(address.slice(2, 8) || "deadbe", 16) % 100;
  const tokens: TokenBalance[] = [
    {
      symbol: "STRK",
      name: "Starknet Token",
      balance: (150 + seed * 2.3).toFixed(4),
      balanceFormatted: `${(150 + seed * 2.3).toFixed(2)} STRK`,
      usdValue: (150 + seed * 2.3) * MOCK_PRICES.STRK,
      logoUrl: TOKEN_LOGOS.STRK,
      address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      isBTC: false,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: (0.05 + seed * 0.001).toFixed(6),
      balanceFormatted: `${(0.05 + seed * 0.001).toFixed(4)} ETH`,
      usdValue: (0.05 + seed * 0.001) * MOCK_PRICES.ETH,
      logoUrl: TOKEN_LOGOS.ETH,
      address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      isBTC: false,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: (250 + seed * 5).toFixed(2),
      balanceFormatted: `${(250 + seed * 5).toFixed(2)} USDC`,
      usdValue: (250 + seed * 5) * MOCK_PRICES.USDC,
      logoUrl: TOKEN_LOGOS.USDC,
      address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
      isBTC: false,
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      balance: (0.001 + seed * 0.00001).toFixed(8),
      balanceFormatted: `${(0.001 + seed * 0.00001).toFixed(6)} WBTC`,
      usdValue: (0.001 + seed * 0.00001) * MOCK_PRICES.WBTC,
      logoUrl: TOKEN_LOGOS.WBTC,
      address: "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
      isBTC: true,
    },
  ];
  const totalUsdValue = tokens.reduce((sum, t) => sum + t.usdValue, 0);
  return { totalUsdValue, tokens, lastUpdated: new Date(), isDemo: true };
}

export function usePortfolio(walletAddress: string | null) {
  const [portfolio, setPortfolio] = useState<(Portfolio & { isDemo?: boolean }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!walletAddress) {
      setPortfolio(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch real on-chain balances via StarkZap SDK (server-side)
      const res = await fetch(`/api/starkzap?address=${encodeURIComponent(walletAddress)}`);

      if (res.ok) {
        const data = await res.json();

        if (data.live && data.balances?.length > 0) {
          // Map SDK response to our Portfolio shape
          const tokens: TokenBalance[] = data.balances.map(
            (b: { symbol: string; name: string; balance: string; tokenAddress: string; decimals: number }) => ({
              symbol: b.symbol,
              name: b.name,
              balance: b.balance,
              balanceFormatted: `${parseFloat(b.balance).toFixed(b.decimals <= 6 ? 2 : 4)} ${b.symbol}`,
              usdValue: parseFloat(b.balance) * (MOCK_PRICES[b.symbol] ?? 0),
              logoUrl: TOKEN_LOGOS[b.symbol] ?? "",
              address: b.tokenAddress,
              isBTC: BTC_TOKENS.has(b.symbol),
            })
          );

          const totalUsdValue = tokens.reduce((sum, t) => sum + t.usdValue, 0);
          const allZero = tokens.every((t) => parseFloat(t.balance) === 0);

          if (allZero) {
            // Wallet has no testnet funds — show demo data with indicator
            setPortfolio(getDemoPortfolio(walletAddress));
          } else {
            setPortfolio({ totalUsdValue, tokens, lastUpdated: new Date(), isDemo: false });
          }
          return;
        }
      }

      // Fallback to demo data if API fails
      setPortfolio(getDemoPortfolio(walletAddress));
    } catch (e) {
      console.error("[usePortfolio] Error:", e);
      setError(null); // Don't show error — just use demo data silently
      setPortfolio(getDemoPortfolio(walletAddress));
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { portfolio, loading, error, refresh };
}
