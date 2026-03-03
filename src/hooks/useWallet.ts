"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useMemo } from "react";

export function useWallet() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const walletAddress = useMemo(() => {
    if (!user?.linkedAccounts) return null;
    const wallet = user.linkedAccounts.find(
      (a: { type: string; walletClientType?: string }) =>
        a.type === "wallet" && a.walletClientType === "privy"
    ) as { address?: string } | undefined;
    return wallet?.address ?? null;
  }, [user]);

  return {
    ready,
    authenticated,
    user,
    login,
    logout,
    walletAddress,
  };
}
