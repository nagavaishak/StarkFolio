"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server — Privy validates App ID during initialization
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Show app without auth if no Privy ID configured (dev fallback)
  if (!appId || appId === "your-privy-app-id-here" || appId === "placeholder-app-id") {
    return <>{children}</>;
  }

  return (
    <PrivyAuthProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#F7931A",
          logo: "/logo.svg",
        },
        loginMethods: ["email", "google", "apple"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyAuthProvider>
  );
}
