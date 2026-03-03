"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useMemo } from "react";

export function useWallet() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const embeddedWallet = useMemo(() => {
    if (!user) return null;
    return user.linkedAccounts.find(
      (a) => a.type === "wallet" && a.walletClientType === "privy"
    ) ?? null;
  }, [user]);

  const walletAddress = (embeddedWallet as { address?: string } | null)?.address ?? null;

  return {
    ready,
    authenticated,
    user,
    login,
    logout,
    walletAddress,
    embeddedWallet,
  };
}
