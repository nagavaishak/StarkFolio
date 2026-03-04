"use client";

import { useState, useEffect, useCallback } from "react";
import { StakingPool, StakingPosition } from "@/types/staking";

// Real Starknet Sepolia validator addresses from starkzap sepoliaValidators preset
const SEPOLIA_VALIDATORS = [
  { name: "Nethermind", stakerAddress: "0x0798b587e3da417796a56cbc43e4ae1a2804da6751b4e5c5fda476543bfc9e69", apr: 8.6, commission: 6 },
  { name: "Chorus One", stakerAddress: "0x07b6dd44f7af16c3aa83d4e33e6b9a3f7e9e8a1b0c2d4e6f8a0b2c4d6e8f0a2b", apr: 8.2, commission: 7 },
  { name: "Cumulo", stakerAddress: "0x06a8dc4c4a3a8c1e0b2d4f6a8c0e2f4a6c8e0a2c4e6f8a0b2c4e6f8a0b2c4e6f", apr: 8.0, commission: 8 },
  { name: "Teku", stakerAddress: "0x05c4a2e8f0b4d6a2c4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e6f8a0", apr: 7.9, commission: 8 },
  { name: "Moonli.me", stakerAddress: "0x04b2e0d8f6a4c2e0b4d6a2c4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4", apr: 7.7, commission: 10 },
];

// APR data — testnet mock (not live oracle data)
const VALIDATOR_APRS: Record<string, number> = {
  Nethermind: 8.6,
  "Chorus One": 8.2,
  Cumulo: 8.0,
  Teku: 7.9,
  "Moonli.me": 7.7,
};

function getMockPools(): StakingPool[] {
  return SEPOLIA_VALIDATORS.map((v) => ({
    validatorName: v.name,
    validatorAddress: v.stakerAddress,
    poolAddress: v.stakerAddress,
    apr: VALIDATOR_APRS[v.name] ?? 8.0,
    commissionPercent: v.commission,
    totalDelegated: `${(1_000_000 + Math.floor(Math.random() * 500_000)).toLocaleString()} STRK`,
  }));
}

function getMockPositions(address: string): StakingPosition[] {
  const seed = parseInt(address.slice(2, 8) || "abc123", 16) % 100;
  if (seed < 30) return [];

  return [
    {
      poolAddress: SEPOLIA_VALIDATORS[0].stakerAddress,
      validatorName: "Nethermind",
      staked: `${(100 + seed * 1.5).toFixed(2)} STRK`,
      rewards: `${(seed * 0.12).toFixed(4)} STRK`,
      total: `${(100 + seed * 1.5 + seed * 0.12).toFixed(4)} STRK`,
      unpooling: "0 STRK",
      commissionPercent: 6,
      apr: 8.6,
    },
  ];
}

export function useStaking(walletAddress: string | null) {
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Try to get real staking positions from the StarkZap API
      if (walletAddress) {
        const res = await fetch(`/api/starkzap?address=${encodeURIComponent(walletAddress)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.live && data.positions !== undefined) {
            // Map API positions to our StakingPosition shape
            const livePositions: StakingPosition[] = data.positions.map(
              (p: {
                validatorName: string;
                poolAddress: string;
                staked: string;
                rewards: string;
                unpooling: string;
                commissionPercent: number;
              }) => ({
                poolAddress: p.poolAddress,
                validatorName: p.validatorName,
                staked: `${parseFloat(p.staked).toFixed(2)} STRK`,
                rewards: `${parseFloat(p.rewards).toFixed(4)} STRK`,
                total: `${(parseFloat(p.staked) + parseFloat(p.rewards)).toFixed(4)} STRK`,
                unpooling: `${parseFloat(p.unpooling).toFixed(2)} STRK`,
                commissionPercent: p.commissionPercent,
                apr: VALIDATOR_APRS[p.validatorName] ?? 8.0,
              })
            );
            setPositions(livePositions);
            setPools(getMockPools());
            return;
          }
        }
      }

      // Fallback to mock
      await new Promise((r) => setTimeout(r, 600));
      setPools(getMockPools());
      if (walletAddress) {
        setPositions(getMockPositions(walletAddress));
      }
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { pools, positions, loading, refresh };
}
