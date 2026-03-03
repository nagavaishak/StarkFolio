"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyAuthProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "placeholder-app-id"}
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
