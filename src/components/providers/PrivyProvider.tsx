"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { useState, useEffect, Component, ReactNode } from "react";
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
    console.error("[Privy] render error:", error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function PrivyProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

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
