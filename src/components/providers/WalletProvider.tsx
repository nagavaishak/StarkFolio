"use client";

import { usePrivy } from "@privy-io/react-auth";
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

interface WalletCtx {
  ready: boolean;
  authenticated: boolean;
  user: ReturnType<typeof usePrivy>["user"];
  login: () => void;
  logout: () => Promise<void>;
  walletAddress: string | null;
  getAccessToken: () => Promise<string | null>;
}

const defaults: WalletCtx = {
  ready: false,
  authenticated: false,
  user: null,
  login: () => {},
  logout: async () => {},
  walletAddress: null,
  getAccessToken: async () => null,
};

// Public context — consumed by useWallet() anywhere in the tree
export const WalletContext = createContext<WalletCtx>(defaults);

// Private setter context — used by WalletBridge to push Privy state upward
type CtxSetter = (ctx: WalletCtx) => void;
const WalletSetterContext = createContext<CtxSetter>(() => {});

/**
 * WalletProvider wraps the ENTIRE app (outside PrivyAuthProvider).
 * Children always render here with safe defaults, even if Privy fails.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<WalletCtx>(defaults);
  return (
    <WalletSetterContext.Provider value={setCtx}>
      <WalletContext.Provider value={ctx}>
        {children}
      </WalletContext.Provider>
    </WalletSetterContext.Provider>
  );
}

/**
 * WalletBridge renders INSIDE PrivyAuthProvider (called from PrivyProvider).
 * It reads Privy state and pushes it up into WalletContext via the setter.
 * Renders null — no UI impact.
 */
export function WalletBridge() {
  const setCtx = useContext(WalletSetterContext);
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();

  const walletAddress = useMemo(() => {
    if (!user?.linkedAccounts) return null;
    const wallet = user.linkedAccounts.find(
      (a: { type: string; walletClientType?: string }) =>
        a.type === "wallet" && a.walletClientType === "privy"
    ) as { address?: string } | undefined;
    return wallet?.address ?? null;
  }, [user]);

  useEffect(() => {
    setCtx({ ready, authenticated, user, login, logout, walletAddress, getAccessToken });
    // Reset to defaults when WalletBridge unmounts (e.g. Privy error)
    return () => setCtx(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated, user, walletAddress]);

  return null;
}
