"use client";

import { ExternalLink, TrendingUp, Wallet, Coins, CheckCircle } from "lucide-react";
import { getTxUrl } from "@/lib/utils/explorer";

interface ToolResultCardProps {
  toolName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

export function ToolResultCard({ toolName, result }: ToolResultCardProps) {
  if (!result || result.error) return null;

  // Portfolio balances card
  if (toolName === "get_portfolio_balances" && result.balances) {
    return (
      <div className="glass rounded-xl p-3 space-y-2 border border-white/8 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-semibold text-white">Portfolio</span>
          <span className="mono text-xs text-orange-400 ml-auto">${parseFloat(result.totalUsdValue).toLocaleString()}</span>
        </div>
        {result.balances.map((b: { symbol: string; balance: string; usdValue: string }) => (
          <div key={b.symbol} className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{b.symbol}</span>
            <div className="text-right">
              <span className="mono text-white">{b.balance}</span>
              <span className="text-gray-500 ml-2">${parseFloat(b.usdValue).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Staking pools card
  if (toolName === "get_staking_pools" && result.pools) {
    return (
      <div className="glass rounded-xl p-3 space-y-1.5 border border-white/8 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-semibold text-white">Staking Pools</span>
        </div>
        {result.pools.map((p: { validator: string; apr: string; commission: string }) => (
          <div key={p.validator} className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{p.validator}</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">{p.commission} fee</span>
              <span className="mono text-green-400 font-semibold">{p.apr}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Transaction result card
  if ((toolName === "claim_rewards" || toolName === "claim_all_rewards" || toolName === "transfer_tokens") && result.txHash) {
    return (
      <div className="glass rounded-xl p-3 border border-green-500/20 bg-green-500/5 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs font-semibold text-white">Transaction Submitted</span>
        </div>
        {result.totalClaimed && (
          <p className="text-xs text-gray-400">Claimed: <span className="text-green-400 font-semibold">{result.totalClaimed}</span></p>
        )}
        {result.rewardsClaimed && (
          <p className="text-xs text-gray-400">Claimed: <span className="text-green-400 font-semibold">{result.rewardsClaimed}</span></p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="mono text-xs text-gray-500 truncate">{result.txHash}</span>
          <a
            href={getTxUrl(result.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-purple-400 hover:text-purple-300"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-[10px] text-gray-600 mt-1">{result.note}</p>
      </div>
    );
  }

  // Recommendation card
  if (toolName === "recommend_best_yield" && result.recommendation) {
    return (
      <div className="glass rounded-xl p-3 border border-orange-500/20 bg-orange-500/5 mt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-semibold text-white">Recommendation</span>
          </div>
          <span className="mono text-base font-bold text-orange-400">{result.apr}</span>
        </div>
        <p className="text-xs text-white font-medium">{result.recommendation}</p>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{result.reasoning}</p>
      </div>
    );
  }

  return null;
}
