"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { useState, useEffect, Component, ReactNode } from "react";
import { WalletBridge } from "./WalletProvider";

// Hardcoded as backup — this is a public client-side identifier, not a secret
const PRIVY_APP_ID =
  process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmmb7r93600jq0dkvm8kyz0o0";

class PrivyErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("[Privy] init error (WalletContext keeps safe defaults):", error.message);
  }
  render() {
    // If Privy fails, render nothing — WalletContext stays at safe defaults
    // Children render separately (outside this tree), so app still works
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/**
 * PrivyProvider renders as a SIBLING to app children inside WalletProvider.
 * It does NOT wrap children — children live outside the Privy tree entirely.
 * WalletBridge (inside PrivyAuthProvider) pushes auth state into WalletContext.
 */
export function PrivyProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on the server — children render via WalletProvider above
  if (!mounted) return null;

  return (
    <PrivyErrorBoundary>
      <PrivyAuthProvider
        appId={PRIVY_APP_ID}
        config={{
          appearance: {
            theme: "dark",
            accentColor: "#F7931A",
          },
        }}
      >
        <WalletBridge />
      </PrivyAuthProvider>
    </PrivyErrorBoundary>
  );
}
