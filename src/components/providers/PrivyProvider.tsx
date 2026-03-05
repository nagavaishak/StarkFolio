"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { useState, useEffect, Component, ReactNode } from "react";
import { WalletBridge } from "./WalletProvider";

const PRIVY_APP_ID =
  process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmmcpau5z01130cl5w8j1e96o";

/**
 * Error boundary that renders children even if Privy crashes.
 * This way the app still works (with no-op wallet defaults).
 */
class PrivyErrorBoundary extends Component<
  { children: ReactNode; fallbackChildren: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallbackChildren: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("[Privy] initialization error:", error.message);
  }
  render() {
    // On error: render the app children WITHOUT Privy (safe defaults)
    if (this.state.hasError) return <>{this.props.fallbackChildren}</>;
    return this.props.children;
  }
}

/**
 * PrivyProvider wraps children INSIDE PrivyAuthProvider so that
 * WalletBridge can immediately push Privy state (including login)
 * into WalletContext.
 *
 * Before client mount: children render alone (no Privy, safe defaults).
 * After mount: children render inside PrivyAuthProvider + WalletBridge.
 * On Privy error: children render alone (error boundary catches it).
 */
export function PrivyProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR / first client render: just render children with default WalletContext
  if (!mounted) {
    return <>{children}</>;
  }

  // Client: wrap children inside PrivyAuthProvider
  return (
    <PrivyErrorBoundary fallbackChildren={children}>
      <PrivyAuthProvider
        appId={PRIVY_APP_ID}
        config={{
          appearance: {
            theme: "dark",
            accentColor: "#F7931A",
          },
          embeddedWallets: {
            ethereum: {
              createOnLogin: "users-without-wallets",
            },
          },
        }}
      >
        <WalletBridge />
        {children}
      </PrivyAuthProvider>
    </PrivyErrorBoundary>
  );
}
