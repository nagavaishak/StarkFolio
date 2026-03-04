"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@privy-io/react-auth";
import { useWallet } from "@/hooks/useWallet";
import {
  Bitcoin,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Bot,
  Lock,
  BarChart3,
} from "lucide-react";

// ─── Chat Mockup (Hero) ────────────────────────────────────────────────────────
function ChatMockup() {
  const messages = [
    { role: "user", text: "What's my best yield option right now?" },
    {
      role: "ai",
      text: "Nethermind is offering 8.6% APR with only 6% commission — the best on Sepolia right now.",
    },
    {
      role: "ai",
      text: "💡 Tip: Split 60% Nethermind + 40% Chorus One for diversified yield.",
    },
    { role: "user", text: "Stake 100 STRK with Nethermind" },
    {
      role: "ai",
      text: "✅ Staking 100 STRK with Nethermind. Gasless via AVNU — confirmed!",
    },
  ];

  return (
    <div className="float-anim">
      <div
        className="glass rounded-2xl overflow-hidden shadow-2xl"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div className="bg-[#0d1117] px-4 py-3 flex items-center gap-2 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Bot className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-semibold text-gray-300">StarkFolio AI</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-soft" />
            <span className="text-[10px] text-gray-500">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-[#080b14] p-4 space-y-3 min-w-[340px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-orange-500/20 border border-orange-500/25 text-orange-100"
                    : "bg-white/5 border border-white/8 text-gray-300"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/8 px-4 py-2.5 rounded-xl flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 pulse-soft" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 pulse-soft" style={{ animationDelay: "200ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 pulse-soft" style={{ animationDelay: "400ms" }} />
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="bg-[#0d1117] px-4 py-3 border-t border-white/5 flex items-center gap-2">
          <div className="flex-1 bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-gray-600">
            Ask anything about your portfolio...
          </div>
          <button className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/25 flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-orange-400" />
          </button>
        </div>
      </div>

      {/* Floating stat cards */}
      <div
        className="absolute -left-8 top-16 glass rounded-xl px-3 py-2 shadow-lg"
        style={{ animation: "float-y 4.2s ease-in-out infinite 0.8s" }}
      >
        <p className="text-[10px] text-gray-500">Best APR</p>
        <p className="mono text-lg font-black text-orange-400">8.6%</p>
      </div>
      <div
        className="absolute -right-6 bottom-20 glass rounded-xl px-3 py-2 shadow-lg"
        style={{ animation: "float-y 3.8s ease-in-out infinite 1.2s" }}
      >
        <p className="text-[10px] text-gray-500">Gas Cost</p>
        <p className="mono text-lg font-black text-green-400">$0.00</p>
      </div>
    </div>
  );
}

// ─── Validator Mockup (Staking Section) ───────────────────────────────────────
function ValidatorMockup() {
  const validators = [
    { name: "Nethermind", apr: "8.6%", comm: "6%", best: true },
    { name: "Chorus One", apr: "8.2%", comm: "7%", best: false },
    { name: "Cumulo", apr: "8.0%", comm: "8%", best: false },
    { name: "Teku", apr: "7.9%", comm: "8%", best: false },
    { name: "Moonli.me", apr: "7.7%", comm: "10%", best: false },
  ];

  return (
    <div className="glass rounded-2xl p-1 overflow-hidden">
      <div className="bg-[#0d1117] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <p className="text-xs font-semibold text-gray-400">Starknet Validators</p>
          <span className="text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
            Live
          </span>
        </div>
        {validators.map(({ name, apr, comm, best }) => (
          <div
            key={name}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              best
                ? "bg-orange-500/8 border border-orange-500/20"
                : "bg-white/[0.02] border border-white/5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  best
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/25"
                    : "bg-white/5 text-gray-500 border border-white/8"
                }`}
              >
                {name[0]}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{name}</p>
                <p className="text-[10px] text-gray-600">{comm} commission</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="mono text-sm font-bold text-green-400">{apr}</span>
              {best && (
                <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full border border-orange-500/20">
                  Best
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Portfolio Mockup ─────────────────────────────────────────────────────────
function PortfolioMockup() {
  const tokens = [
    { symbol: "STRK", amount: "450.00", usd: "$171.00", color: "text-orange-400" },
    { symbol: "ETH", amount: "0.0820", usd: "$262.40", color: "text-blue-400" },
    { symbol: "USDC", amount: "4,200.00", usd: "$4,200.00", color: "text-green-400" },
    { symbol: "WBTC", amount: "0.00185", usd: "$177.60", color: "text-yellow-400" },
  ];

  return (
    <div className="glass rounded-2xl p-1 overflow-hidden">
      <div className="bg-[#0d1117] rounded-xl p-5">
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-1">Total Portfolio Value</p>
          <p className="mono text-3xl font-black text-white">$4,811.00</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <p className="text-xs text-green-400 font-medium">+2.4% today</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {tokens.map(({ symbol, amount, usd, color }) => (
            <div key={symbol} className="glass rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className={`text-[9px] font-black ${color}`}>{symbol[0]}</span>
                </div>
                <span className="text-xs font-semibold text-white">{symbol}</span>
              </div>
              <p className={`mono text-sm font-bold ${color}`}>{amount}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{usd}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] text-gray-600">Staking rewards pending</p>
          <p className="mono text-xs text-orange-400 font-semibold">+12.48 STRK</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { ready, authenticated } = useWallet();
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => {
      router.push("/dashboard");
    },
  });

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  // Scroll-triggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLaunch = () => {
    if (authenticated) {
      router.push("/dashboard");
    } else {
      login();
    }
  };

  const TICKER = [
    { label: "Nethermind APR", value: "8.6%" },
    { label: "Chorus One", value: "8.2%" },
    { label: "Cumulo", value: "8.0%" },
    { label: "Teku", value: "7.9%" },
    { label: "Gas cost", value: "$0.00" },
    { label: "Network", value: "Starknet Sepolia" },
    { label: "Transactions", value: "Gasless" },
    { label: "Wallet setup", value: "30 sec" },
  ];

  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080b14]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/30 to-purple-600/30 border border-orange-500/20 flex items-center justify-center">
              <Bitcoin className="w-4 h-4 text-orange-400" />
            </div>
            <span className="font-bold text-white text-lg">
              Stark<span className="text-orange-400">Folio</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="#how-it-works"
              className="text-sm text-gray-500 hover:text-gray-200 transition-colors hidden sm:block"
            >
              How it works
            </a>
            <a
              href="https://github.com/nagavaishak/StarkFolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-200 transition-colors hidden sm:block"
            >
              GitHub
            </a>
            <button
              onClick={handleLaunch}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-all duration-200 flex items-center gap-1.5"
            >
              {authenticated ? "Open App" : "Launch App"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/7 blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/9 blur-[110px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Starkzap Developer Challenge · Starknet Sepolia
              </div>

              <h1 className="text-5xl lg:text-[5.5rem] font-black tracking-tight leading-[1.02]">
                Bitcoin yield.
                <br />
                <span className="gradient-text">On autopilot.</span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-lg">
                StarkFolio is an AI agent that manages your crypto portfolio on
                Starknet — staking, compounding, and optimizing yield through
                natural conversation.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleLaunch}
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-base shadow-2xl hover:from-orange-400 hover:to-orange-300 transition-all duration-200 flex items-center gap-2.5 glow-btc"
                >
                  <Zap className="w-4 h-4" />
                  {authenticated ? "Open Dashboard" : "Launch App — Free"}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://github.com/nagavaishak/StarkFolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-4 rounded-xl glass text-gray-300 font-semibold text-base hover:bg-white/5 transition-all duration-200 flex items-center gap-2"
                >
                  View on GitHub
                </a>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-8 pt-2">
                {[
                  { value: "8.6%", label: "Top APR" },
                  { value: "$0", label: "Gas cost" },
                  { value: "AI", label: "Powered" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="mono text-2xl font-black text-white">{value}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Chat Mockup */}
            <div className="relative hidden lg:flex justify-center">
              <ChatMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────────────── */}
      <div className="border-y border-white/5 bg-[#0a0e18] py-3 overflow-hidden">
        <div className="ticker-track flex items-center gap-10">
          {[...TICKER, ...TICKER].map((item, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-1 h-1 rounded-full bg-orange-500/50" />
              <span className="text-xs text-gray-500">{item.label}</span>
              <span className="mono text-xs font-bold text-orange-400">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16" data-animate>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Three steps to yield
            </h2>
            <p className="text-gray-500 text-base max-w-md mx-auto">
              No seed phrases. No gas. No 12-word headaches.
            </p>
          </div>

          {/* Step flow with connecting lines */}
          <div className="relative" data-animate>
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-orange-500/30 via-white/10 to-green-500/30" />

            <div className="grid md:grid-cols-3 gap-8 relative">
              {[
                {
                  n: "1",
                  color: "orange",
                  title: "Sign in with email",
                  desc: "Privy creates a self-custodial Starknet wallet instantly. No extension, no seed phrase, no setup time.",
                  detail: "Powered by Privy + StarkZap",
                },
                {
                  n: "2",
                  color: "white",
                  title: "Tell the AI what to do",
                  desc: "\"Stake 100 STRK with Nethermind\" — it reads your balances, compares APRs, and prepares the transaction.",
                  detail: "Gemini AI + StarkZap SDK",
                },
                {
                  n: "3",
                  color: "green",
                  title: "Transaction executes gasless",
                  desc: "AVNU Paymaster sponsors every transaction. You confirm once; your yield starts accruing.",
                  detail: "AVNU Paymaster · feeMode: sponsored",
                },
              ].map(({ n, color, title, desc, detail }) => (
                <div key={n} className="flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 relative z-10 ${
                      color === "orange"
                        ? "bg-orange-500/10 border-orange-500/40"
                        : color === "green"
                        ? "bg-green-500/10 border-green-500/40"
                        : "bg-white/5 border-white/20"
                    }`}
                  >
                    <span
                      className={`mono text-2xl font-black ${
                        color === "orange"
                          ? "text-orange-400"
                          : color === "green"
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {n}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3 max-w-xs">{desc}</p>
                  <span className="mono text-[10px] text-gray-700 border border-white/5 px-2 py-1 rounded-full bg-white/[0.02]">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature: AI Chat ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div data-animate>
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
              AI-Powered
            </span>
            <h2 className="text-3xl lg:text-5xl font-black mt-4 mb-6 leading-tight">
              Your portfolio manager,
              <br />
              in plain English
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Ask anything. Get instant, accurate answers. The AI knows your
              balances, finds the best yields, and executes transactions — with
              your permission first.
            </p>
            <ul className="space-y-3.5">
              {[
                "Check balances & USD values across all your tokens",
                "Compare APRs across all Starknet validators in real-time",
                "Stake, claim rewards, and transfer — all gasless",
                "Always explains every action before executing",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                  <ChevronRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={handleLaunch}
              className="mt-8 px-5 py-3 rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-400 font-semibold text-sm hover:bg-orange-500/20 transition-colors flex items-center gap-2"
            >
              Try it free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div data-animate style={{ transitionDelay: "100ms" }}>
            <div
              className="glass rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
            >
              <div className="bg-[#0d1117] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <Bot className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">StarkFolio AI</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-soft ml-auto" />
              </div>
              <div className="bg-[#080b14] p-5 space-y-3">
                {[
                  { role: "user", text: "What's my best yield option right now?" },
                  {
                    role: "ai",
                    text: "Based on current Starknet rates, Nethermind offers the best APR at 8.6% with only 6% commission — lowest among all validators.",
                  },
                  {
                    role: "ai",
                    text: "💡 Recommendation: 60% Nethermind (8.6%) + 40% Chorus One (8.2%) for risk diversification. Want me to stake?",
                  },
                  { role: "user", text: "Yes, stake 100 STRK with Nethermind" },
                  {
                    role: "ai",
                    text: "✅ Staking 100 STRK with Nethermind. Transaction is gasless via AVNU. Done!",
                  },
                ].map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-orange-500/20 border border-orange-500/25 text-orange-100"
                          : "bg-white/5 border border-white/8 text-gray-300"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature: Portfolio ───────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Mockup left */}
          <div className="order-2 lg:order-1" data-animate>
            <PortfolioMockup />
          </div>

          {/* Text right */}
          <div className="order-1 lg:order-2" data-animate style={{ transitionDelay: "100ms" }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
              Portfolio
            </span>
            <h2 className="text-3xl lg:text-5xl font-black mt-4 mb-6 leading-tight">
              All your assets,
              <br />
              one clean view
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              See your STRK, ETH, WBTC, USDC and more — with live USD values,
              staking positions, and pending rewards in a single unified
              dashboard.
            </p>
            <ul className="space-y-3.5">
              {[
                "Live on-chain balance reads via StarkZap SDK",
                "USD value for every token in your wallet",
                "Active staking positions with unclaimed rewards",
                "Transaction history with Voyager explorer links",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                  <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Feature: Staking ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div data-animate>
            <span className="text-xs font-semibold uppercase tracking-widest text-green-400">
              Staking
            </span>
            <h2 className="text-3xl lg:text-5xl font-black mt-4 mb-6 leading-tight">
              Best yield,
              <br />
              zero gas
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Compare validators in real-time, stake STRK in one click, and
              claim rewards — all completely gasless via AVNU Paymaster.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: "8.6%", label: "Top APR", color: "text-orange-400", accent: "orange" },
                { value: "6%", label: "Min fee", color: "text-green-400", accent: "green" },
                { value: "21d", label: "Exit period", color: "text-purple-400", accent: "purple" },
              ].map(({ value, label, color, accent }) => (
                <div key={label} className="glass rounded-xl p-4 text-center">
                  <p className={`mono text-2xl font-black ${color}`}>{value}</p>
                  <p className="text-xs text-gray-600 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleLaunch}
              className="px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-sm hover:bg-green-500/15 transition-colors flex items-center gap-2"
            >
              Start staking
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div data-animate style={{ transitionDelay: "100ms" }}>
            <ValidatorMockup />
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-10">
            Built with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
            {[
              { name: "Starknet", role: "L2 Network" },
              { name: "StarkZap", role: "Portfolio SDK" },
              { name: "AVNU", role: "Gasless Paymaster" },
              { name: "Privy", role: "Wallet Auth" },
              { name: "Gemini AI", role: "Intelligence" },
              { name: "Next.js 16", role: "Framework" },
            ].map(({ name, role }) => (
              <div key={name} className="text-center group">
                <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                  {name}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-orange-500/6 blur-[90px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full bg-purple-600/8 blur-[70px]" />
        </div>

        <div
          className="relative max-w-3xl mx-auto text-center"
          data-animate
        >
          <h2 className="text-4xl lg:text-7xl font-black mb-6 leading-tight">
            Your STRK, earning
            <br />
            <span className="gradient-text">while you sleep</span>
          </h2>
          <p className="text-gray-400 text-xl mb-12 max-w-lg mx-auto leading-relaxed">
            Connect once. StarkFolio finds the best yield, stakes for you, and
            claims rewards — all gasless, all on Starknet.
          </p>
          <button
            onClick={handleLaunch}
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-black text-xl shadow-2xl hover:from-orange-400 hover:to-orange-300 transition-all duration-200 flex items-center gap-3 mx-auto glow-pulse"
          >
            <Zap className="w-6 h-6" />
            {authenticated ? "Go to Dashboard" : "Launch StarkFolio — Free"}
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-xs text-gray-600 mt-5">
            Starknet Sepolia testnet · Gasless via AVNU · Non-custodial
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Bitcoin className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-white">
              Stark<span className="text-orange-400">Folio</span>
            </span>
            <span className="text-xs text-gray-700 ml-1">
              · Starkzap Developer Challenge
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <a
              href="https://github.com/nagavaishak/StarkFolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://starkfolio-umber.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              Live App
            </a>
            <span>Starknet Sepolia</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
