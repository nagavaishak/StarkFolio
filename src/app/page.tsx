"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { LoginCard } from "@/components/onboarding/LoginCard";

export default function Home() {
  const { ready, authenticated } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  return <LoginCard />;
}
