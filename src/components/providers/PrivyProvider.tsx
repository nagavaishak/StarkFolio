"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { WalletBridge } from "./WalletProvider";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Before client mount: render children without Privy.
  // useWallet() reads from WalletContext which returns safe defaults.
  if (!mounted || !appId || appId === "your-privy-app-id-here") {
    return <>{children}</>;
  }

  // After mount: PrivyAuthProvider + WalletBridge (which calls usePrivy() safely).
  return (
    <PrivyAuthProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#F7931A",
        },
      }}
    >
      <WalletBridge>{children}</WalletBridge>
    </PrivyAuthProvider>
  );
}
