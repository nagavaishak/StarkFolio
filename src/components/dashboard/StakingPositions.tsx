"use client";

import { useState } from "react";
import { StakingPool, StakingPosition } from "@/types/staking";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ValidatorList } from "./ValidatorList";
import { formatApr } from "@/lib/utils/format";
import { Zap, TrendingUp, Award } from "lucide-react";

interface StakingPositionsProps {
  pools: StakingPool[];
  positions: StakingPosition[];
  loading: boolean;
}

export function StakingPositions({ pools, positions, loading }: StakingPositionsProps) {
  const [tab, setTab] = useState<"positions" | "validators">("positions");
  const bestPool = [...pools].sort((a, b) => b.apr - a.apr)[0];

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 glass rounded-xl p-1 w-fit">
        {(["positions", "validators"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              tab === t ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t === "positions" ? "My Positions" : "All Validators"}
          </button>
        ))}
      </div>

      {/* Validators tab */}
      {tab === "validators" && !loading && <ValidatorList pools={pools} />}
      {tab === "validators" && loading && (
        <div className="space-y-2">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      )}

      {/* Positions tab */}
      {tab === "positions" && (
        <div className="space-y-4">
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
                <p className="text-xs text-gray-600 mt-1">Ask AI: &quot;Where should I stake my STRK?&quot;</p>
              </div>
            )}
          </div>

          {/* Best Pool Highlight */}
          {!loading && bestPool && (
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Best Yield Now</h3>
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
                <p className="text-xs text-gray-600 mt-2">
                  Ask AI: &quot;Stake 100 STRK with {bestPool.validatorName}&quot;
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
