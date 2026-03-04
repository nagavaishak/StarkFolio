"use client";

import { usePrivy } from "@privy-io/react-auth";
import { createContext, useContext, useMemo } from "react";

interface WalletCtx {
  ready: boolean;
  authenticated: boolean;
  user: ReturnType<typeof usePrivy>["user"];
  login: () => void;
  logout: () => Promise<void>;
  walletAddress: string | null;
}

const defaults: WalletCtx = {
  ready: false,
  authenticated: false,
  user: null,
  login: () => {},
  logout: async () => {},
  walletAddress: null,
};

// Safe defaults context — consumed by useWallet() everywhere in the tree.
// When Privy is not yet mounted, useWallet() returns these safe defaults
// instead of calling usePrivy() (which would throw outside its provider).
export const WalletContext = createContext<WalletCtx>(defaults);

// This component renders INSIDE <PrivyAuthProvider>, so usePrivy() is safe here.
export function WalletBridge({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const walletAddress = useMemo(() => {
    if (!user?.linkedAccounts) return null;
    const wallet = user.linkedAccounts.find(
      (a: { type: string; walletClientType?: string }) =>
        a.type === "wallet" && a.walletClientType === "privy"
    ) as { address?: string } | undefined;
    return wallet?.address ?? null;
  }, [user]);

  return (
    <WalletContext.Provider
      value={{ ready, authenticated, user, login, logout, walletAddress }}
    >
      {children}
    </WalletContext.Provider>
  );
}
