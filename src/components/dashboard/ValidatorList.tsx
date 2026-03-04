"use client";

import { StakingPool } from "@/types/staking";
import { formatApr } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { Shield, TrendingUp, Users } from "lucide-react";

interface ValidatorListProps {
  pools: StakingPool[];
}

const VALIDATOR_DESCRIPTIONS: Record<string, string> = {
  Nethermind: "Leading Ethereum client & infrastructure team",
  "Chorus One": "Institutional-grade staking provider",
  Cumulo: "Decentralized staking pool protocol",
  Teku: "Enterprise Ethereum client by ConsenSys",
  "Moonli.me": "Community-run Starknet validator",
  Karnot: "Starknet infrastructure company",
  Argent: "Leading Starknet wallet provider",
  AVNU: "DEX aggregator on Starknet",
  Braavos: "Smart contract wallet team",
};

export function ValidatorList({ pools }: ValidatorListProps) {
  const sorted = [...pools].sort((a, b) => b.apr - a.apr);
  const best = sorted[0];

  return (
    <div className="space-y-2">
      {sorted.map((pool, i) => (
        <div
          key={pool.poolAddress}
          className={`glass rounded-xl p-4 transition-all ${
            pool.poolAddress === best.poolAddress
              ? "border-orange-500/25 bg-orange-500/5"
              : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold
                  ${i === 0 ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-white/5 text-gray-400 border border-white/10"}`}
              >
                {i + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{pool.validatorName}</span>
                  {i === 0 && <Badge variant="orange">Best APR</Badge>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {VALIDATOR_DESCRIPTIONS[pool.validatorName] ?? "Starknet validator"}
                </p>
              </div>
            </div>
            <span className="mono text-lg font-bold text-green-400">{formatApr(pool.apr)}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-600">Commission</p>
                <p className="text-xs text-gray-300">{pool.commissionPercent}%</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-600">Delegated</p>
                <p className="text-xs text-gray-300 truncate">{pool.totalDelegated?.split(" ")[0] ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-gray-500" />
              <div>
                <p className="text-[10px] text-gray-600">Status</p>
                <p className="text-xs text-green-400">Active</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-600 mt-2">
            Ask AI: &quot;Stake 100 STRK with {pool.validatorName}&quot;
          </p>
        </div>
      ))}
    </div>
  );
}
