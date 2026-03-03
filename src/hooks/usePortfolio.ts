"use client";

import { useState, useEffect, useCallback } from "react";
import { Portfolio, TokenBalance } from "@/types/portfolio";
import { MOCK_PRICES, BTC_TOKENS, TOKEN_LOGOS } from "@/lib/starkzap/tokens";

// Mock portfolio data for testnet demo
// In production: fetches real balances via StarkZap SDK
function getMockPortfolio(address: string): Portfolio {
  // Deterministically vary mock data based on address
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

  return { totalUsdValue, tokens, lastUpdated: new Date() };
}

export function usePortfolio(walletAddress: string | null) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
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
      // TODO: Replace with real StarkZap SDK calls when Privy is configured
      // const sdk = new StarkZap({ network: "sepolia" });
      // const wallet = await sdk.onboard({ strategy: OnboardStrategy.Privy, ... });
      // const tokens = [sepoliaTokens.STRK, sepoliaTokens.ETH, sepoliaTokens.USDC, ...];
      // for (const token of tokens) {
      //   const balance = await wallet.balanceOf(token);
      // }

      await new Promise((r) => setTimeout(r, 800)); // Simulate network
      setPortfolio(getMockPortfolio(walletAddress));
    } catch (e) {
      setError("Failed to load portfolio");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { portfolio, loading, error, refresh };
}
