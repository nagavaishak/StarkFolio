import type { Metadata } from "next";
import "./globals.css";
import { PrivyProvider } from "@/components/providers/PrivyProvider";

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
      <body>
        <PrivyProvider>{children}</PrivyProvider>
      </body>
    </html>
  );
}
