"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useStaking } from "@/hooks/useStaking";
import { useChat } from "@/hooks/useChat";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { StakingPositions } from "@/components/dashboard/StakingPositions";
import { TransactionFeed } from "@/components/dashboard/TransactionFeed";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { shortenAddress } from "@/lib/utils/format";
import { Bitcoin, LogOut, LayoutDashboard, Landmark, MessageSquare, Loader2 } from "lucide-react";

type Tab = "portfolio" | "staking" | "chat";

export default function Dashboard() {
  const router = useRouter();
  const { ready, authenticated, walletAddress, logout } = useWallet();
  const { portfolio, loading: portfolioLoading, refresh: refreshPortfolio } = usePortfolio(walletAddress);
  const { pools, positions, loading: stakingLoading } = useStaking(walletAddress);
  const { messages, isLoading: chatLoading, sendMessage } = useChat(walletAddress);
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "portfolio", label: "Portfolio", icon: LayoutDashboard },
    { id: "staking", label: "Staking", icon: Landmark },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#080b14] flex flex-col">
      {/* Top nav */}
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/30 to-purple-600/30 border border-orange-500/20 flex items-center justify-center">
              <Bitcoin className="w-4 h-4 text-orange-400" />
            </div>
            <span className="font-bold text-white text-base">
              Stark<span className="text-orange-400">Folio</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {walletAddress && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="mono text-xs text-gray-400">{shortenAddress(walletAddress)}</span>
              </div>
            )}
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-gray-400 hover:text-white text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Desktop layout — split panel */}
      <div className="hidden lg:flex flex-1 max-w-7xl mx-auto w-full gap-4 p-4">
        {/* Left: Portfolio + Staking (60%) */}
        <div className="w-[60%] flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-72px)] pr-1">
          <PortfolioOverview
            portfolio={portfolio}
            loading={portfolioLoading}
            onRefresh={refreshPortfolio}
          />
          <StakingPositions
            pools={pools}
            positions={positions}
            loading={stakingLoading}
          />
          <TransactionFeed walletAddress={walletAddress} />
          <div className="h-4" />
        </div>

        {/* Right: AI Chat (40%) */}
        <div className="w-[40%] max-h-[calc(100vh-72px)]">
          <ChatPanel
            messages={messages}
            isLoading={chatLoading}
            onSend={sendMessage}
            walletConnected={!!walletAddress}
          />
        </div>
      </div>

      {/* Mobile: Tabbed layout */}
      <div className="lg:hidden flex flex-col flex-1 overflow-hidden">
        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "portfolio" && (
            <PortfolioOverview
              portfolio={portfolio}
              loading={portfolioLoading}
              onRefresh={refreshPortfolio}
            />
          )}
          {activeTab === "staking" && (
            <StakingPositions
              pools={pools}
              positions={positions}
              loading={stakingLoading}
            />
          )}
          {activeTab === "chat" && (
            <div className="h-[calc(100vh-160px)]">
              <ChatPanel
                messages={messages}
                isLoading={chatLoading}
                onSend={sendMessage}
                walletConnected={!!walletAddress}
              />
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <nav className="border-t border-white/5 flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                activeTab === id ? "text-orange-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
              {id === "chat" && chatLoading && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-400 pulse-soft" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
