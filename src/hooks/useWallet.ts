"use client";

import { useMemo } from "react";

// Safe import — returns dummy hooks if Privy is not configured
function safeUsePrivy() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { usePrivy } = require("@privy-io/react-auth");
    return usePrivy();
  } catch {
    return {
      ready: true,
      authenticated: false,
      user: null,
      login: () => alert("Configure NEXT_PUBLIC_PRIVY_APP_ID to enable login"),
      logout: async () => {},
    };
  }
}

export function useWallet() {
  const { ready, authenticated, user, login, logout } = safeUsePrivy();

  const walletAddress = useMemo(() => {
    if (!user?.linkedAccounts) return null;
    const wallet = user.linkedAccounts.find(
      (a: { type: string; walletClientType?: string }) =>
        a.type === "wallet" && a.walletClientType === "privy"
    ) as { address?: string } | undefined;
    return wallet?.address ?? null;
  }, [user]);

  return {
    ready: ready as boolean,
    authenticated: authenticated as boolean,
    user,
    login: login as () => void,
    logout: logout as () => Promise<void>,
    walletAddress,
  };
}
