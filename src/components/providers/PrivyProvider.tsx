"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { Component, ReactNode } from "react";
import { WalletBridge } from "./WalletProvider";

const PRIVY_APP_ID =
  process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmmb7r93600jq0dkvm8kyz0o0";

class PrivyErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("[Privy] error:", error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function PrivyProviderInner({ children }: { children: ReactNode }) {
  return (
    <PrivyErrorBoundary fallback={<>{children}</>}>
      <PrivyAuthProvider
        appId={PRIVY_APP_ID}
        config={{
          appearance: {
            theme: "dark",
            accentColor: "#F7931A",
          },
        }}
      >
        {children}
        <WalletBridge />
      </PrivyAuthProvider>
    </PrivyErrorBoundary>
  );
}

// Dynamic import ensures this never runs on the server
import dynamic from "next/dynamic";
export const PrivyProvider = dynamic(
  () => Promise.resolve(PrivyProviderInner),
  { ssr: false }
);
