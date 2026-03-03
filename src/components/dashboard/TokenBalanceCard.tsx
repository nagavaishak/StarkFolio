"use client";

import { TokenBalance } from "@/types/portfolio";
import { formatUsd } from "@/lib/utils/format";
import { Bitcoin } from "lucide-react";

interface TokenBalanceCardProps {
  token: TokenBalance;
}

export function TokenBalanceCard({ token }: TokenBalanceCardProps) {
  return (
    <div className="relative glass rounded-xl p-4 transition-all duration-200 hover:border-white/20 group">
      {token.isBTC && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {token.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={token.logoUrl}
              alt={token.symbol}
              width={28}
              height={28}
              className="rounded-full"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <Bitcoin className="w-3.5 h-3.5 text-orange-400" />
            </div>
          )}
          <div>
            <span className="text-sm font-semibold text-white">{token.symbol}</span>
            {token.isBTC && (
              <span className="ml-1.5 text-[10px] text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-full border border-orange-400/20">BTC</span>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{token.name}</span>
      </div>

      <div>
        <p className="mono text-lg font-bold text-white leading-none">
          {token.balanceFormatted}
        </p>
        <p className="mono text-sm text-gray-400 mt-1">
          {formatUsd(token.usdValue)}
        </p>
      </div>
    </div>
  );
}
