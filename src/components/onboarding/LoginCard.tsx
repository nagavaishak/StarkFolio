"use client";

import { useWallet } from "@/hooks/useWallet";
import { Bitcoin, Zap, Shield, TrendingUp, Loader2 } from "lucide-react";

export function LoginCard() {
  const { login, ready } = useWallet();

  const features = [
    { icon: TrendingUp, text: "Best Bitcoin yield on Starknet" },
    { icon: Zap, text: "Gasless transactions via AVNU" },
    { icon: Shield, text: "Non-custodial wallet, your keys" },
  ];

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/30 to-purple-600/30 border border-orange-500/20 mb-6 shadow-2xl glow-btc">
            <Bitcoin className="w-8 h-8 text-orange-400" />
          </div>

          <h1 className="text-4xl font-bold text-white tracking-tight">
            Stark<span className="text-orange-400">Folio</span>
          </h1>
          <p className="mt-3 text-gray-400 text-lg leading-snug">
            Your AI portfolio manager for<br />
            <span className="text-orange-300 font-medium">Bitcoin yield on Starknet</span>
          </p>
        </div>

        {/* Feature list */}
        <div className="glass rounded-2xl p-5 space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-sm text-gray-300">{text}</span>
            </div>
          ))}
        </div>

        {/* Login CTA */}
        <div className="space-y-3">
          <button
            onClick={login}
            disabled={!ready}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-base shadow-xl hover:from-orange-400 hover:to-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 glow-btc"
          >
            {!ready ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Sign in with Email or Google
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-600">
            No seed phrase. No wallet extension. Just sign in.
          </p>
        </div>

        {/* Powered by badges */}
        <div className="flex items-center justify-center gap-4">
          {["Privy", "Starkzap", "AVNU"].map((name) => (
            <div key={name} className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
