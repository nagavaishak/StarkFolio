import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { PrivyProvider } from "@/components/providers/PrivyProvider";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "StarkFolio — AI Bitcoin Yield Agent on Starknet",
  description:
    "Your AI portfolio manager for Bitcoin and crypto yield on Starknet. Stake, claim rewards, and manage assets through natural language — all gasless.",
  keywords: ["Starknet", "Bitcoin", "DeFi", "AI", "yield", "staking", "BTCFi"],
  openGraph: {
    title: "StarkFolio",
    description: "AI-powered Bitcoin yield agent on Starknet",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ErrorBoundary>
          {/*
           * WalletProvider wraps children with WalletContext (safe defaults).
           * PrivyProvider mounts as a sibling — it NEVER wraps children.
           * WalletBridge (inside Privy) pushes auth state into WalletContext.
           * If Privy fails, children still render fine with ready:false defaults.
           */}
          <WalletProvider>
            <PrivyProvider>
              {children}
            </PrivyProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
