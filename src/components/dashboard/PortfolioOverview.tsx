"use client";

import { Portfolio } from "@/types/portfolio";
import { TokenBalanceCard } from "./TokenBalanceCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatUsd } from "@/lib/utils/format";
import { RefreshCw, TrendingUp } from "lucide-react";

interface PortfolioOverviewProps {
  portfolio: Portfolio | null;
  loading: boolean;
  onRefresh: () => void;
}

export function PortfolioOverview({ portfolio, loading, onRefresh }: PortfolioOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Total Value Header */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Portfolio Value</span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <Skeleton className="h-9 w-40 mt-1" />
        ) : (
          <div className="flex items-end gap-3">
            <span className="mono text-3xl font-bold text-white">
              {formatUsd(portfolio?.totalUsdValue ?? 0)}
            </span>
            <div className="flex items-center gap-1 text-green-400 mb-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Live</span>
            </div>
          </div>
        )}

        {portfolio && (
          <p className="text-xs text-gray-500 mt-2">
            Across {portfolio.tokens.length} assets · Updated just now
          </p>
        )}
      </div>

      {/* Token Grid */}
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Assets</h3>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : portfolio?.tokens.length ? (
          <div className="grid grid-cols-2 gap-3">
            {portfolio.tokens.map((token) => (
              <TokenBalanceCard key={token.symbol} token={token} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm">No assets yet.</p>
            <p className="text-gray-600 text-xs mt-1">Your balances will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
