"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId || appId === "your-privy-app-id-here") {
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
        loginMethods: ["email", "google"],
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
