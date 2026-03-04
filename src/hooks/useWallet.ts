"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useMemo } from "react";

// Safe wrapper: returns no-op defaults if called outside PrivyProvider
// (during SSR or before client mount)
function useSafePrivy() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return usePrivy();
  } catch {
    return {
      ready: false as const,
      authenticated: false as const,
      user: null,
      login: () => {},
      logout: async () => {},
    };
  }
}

export function useWallet() {
  const { ready, authenticated, user, login, logout } = useSafePrivy();

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
