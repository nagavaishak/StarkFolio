"use client";

import { PrivyProvider as PrivyAuthProvider } from "@privy-io/react-auth";
import { useState, useEffect, Suspense, Component, ReactNode } from "react";
import { WalletBridge } from "./WalletProvider";

// Inner error boundary: if PrivyAuthProvider itself throws, fall back to
// rendering children without Privy (landing page still works, login disabled).
class PrivyErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      // Log for debugging, show fallback (children without Privy)
      console.error("[PrivyProvider] init error:", this.state.error?.message);
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function PrivyProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Before client mount: render children without Privy (safe defaults via WalletContext).
  if (!mounted || !appId || appId === "your-privy-app-id-here") {
    return <>{children}</>;
  }

  // After mount: wrap with Privy. Suspense handles React use() promises.
  // PrivyErrorBoundary catches any init throws — app still renders without login.
  return (
    <PrivyErrorBoundary fallback={<>{children}</>}>
      <Suspense fallback={<>{children}</>}>
        <PrivyAuthProvider
          appId={appId}
          config={{
            appearance: {
              theme: "dark",
              accentColor: "#F7931A",
            },
          }}
        >
          <WalletBridge>{children}</WalletBridge>
        </PrivyAuthProvider>
      </Suspense>
    </PrivyErrorBoundary>
  );
}
