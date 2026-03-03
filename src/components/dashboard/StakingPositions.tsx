"use client";

import { StakingPool, StakingPosition } from "@/types/staking";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatApr } from "@/lib/utils/format";
import { Zap, TrendingUp, Award } from "lucide-react";

interface StakingPositionsProps {
  pools: StakingPool[];
  positions: StakingPosition[];
  loading: boolean;
}

export function StakingPositions({ pools, positions, loading }: StakingPositionsProps) {
  const bestPool = [...pools].sort((a, b) => b.apr - a.apr)[0];

  return (
    <div className="space-y-4">
      {/* Active Positions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium">Active Staking</h3>
          {positions.length > 0 && (
            <Badge variant="green">{positions.length} Active</Badge>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : positions.length > 0 ? (
          <div className="space-y-2">
            {positions.map((pos) => (
              <div key={pos.poolAddress} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-white">{pos.validatorName}</span>
                  </div>
                  <Badge variant="green">{formatApr(pos.apr ?? 0)} APR</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <p className="text-xs text-gray-500">Staked</p>
                    <p className="mono text-sm font-semibold text-white mt-0.5">{pos.staked}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rewards</p>
                    <p className="mono text-sm font-semibold text-green-400 mt-0.5">{pos.rewards}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Commission: {pos.commissionPercent}% · Ask AI to claim</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-5 text-center border border-dashed border-white/10">
            <Zap className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No active staking positions</p>
            <p className="text-xs text-gray-600 mt-1">Ask AI: "Where should I stake my STRK?"</p>
          </div>
        )}
      </div>

      {/* Best Pool Highlight */}
      {!loading && bestPool && (
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Best Yield</h3>
          <div className="glass rounded-xl p-4 border border-orange-500/20 bg-orange-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">{bestPool.validatorName}</span>
              </div>
              <span className="mono text-lg font-bold text-orange-400">{formatApr(bestPool.apr)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {bestPool.commissionPercent}% commission · {bestPool.totalDelegated} delegated
            </p>
            <p className="text-xs text-gray-600 mt-2">Ask AI: "Stake 100 STRK with {bestPool.validatorName}"</p>
          </div>
        </div>
      )}

      {/* All Pools */}
      {!loading && pools.length > 0 && (
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">All Validators</h3>
          <div className="glass rounded-xl divide-y divide-white/5">
            {pools
              .slice()
              .sort((a, b) => b.apr - a.apr)
              .map((pool) => (
                <div key={pool.poolAddress} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <span className="text-sm text-white font-medium">{pool.validatorName}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{pool.commissionPercent}% commission</p>
                  </div>
                  <span className="mono text-sm font-semibold text-green-400">{formatApr(pool.apr)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
