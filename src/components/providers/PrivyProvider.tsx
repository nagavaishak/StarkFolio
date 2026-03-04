"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Before client mount (SSR + first paint): render children without Privy.
  // After mount: wrap with real PrivyAuthProvider.
  if (!mounted || !appId || appId === "your-privy-app-id-here") {
    return <>{children}</>;
  }

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
      {children}
    </PrivyAuthProvider>
  );
}
