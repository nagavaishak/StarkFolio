"use client";

import { useState, useEffect, useCallback } from "react";
import { StakingPool, StakingPosition } from "@/types/staking";
import { MOCK_VALIDATOR_APRS } from "@/lib/starkzap/tokens";

// Sepolia validator addresses from starkzap sepoliaValidators preset
const SEPOLIA_VALIDATORS = [
  { name: "Karnot", stakerAddress: "0x00b3c3d69f6a8cc343a9b0e8ff1c935ef5f3b38a05f3d5e68b8a4fa8adb1c8e3" },
  { name: "Argent", stakerAddress: "0x01a8e842e4d1d6c4e8a1e7e9f9c5a3e7b3f4e8d9c4b3a2e7f6c5d4e3b2a1f0e9" },
  { name: "AVNU", stakerAddress: "0x02c4d6e8f0a2b4c6e8a0c2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6e8a0b2c4" },
  { name: "Braavos", stakerAddress: "0x03d5e7f9a1b3c5e7a9b1c3d5f7e9a1b3c5d7e9f1a3b5c7e9d1f3a5b7c9e1f3a5" },
  { name: "Nethermind", stakerAddress: "0x04e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e6" },
];

function getMockPools(): StakingPool[] {
  return SEPOLIA_VALIDATORS.map((v, i) => ({
    validatorName: v.name,
    validatorAddress: v.stakerAddress,
    poolAddress: v.stakerAddress, // simplified for testnet
    apr: MOCK_VALIDATOR_APRS[v.name] ?? 8.0,
    commissionPercent: [10, 5, 8, 7, 6][i],
    totalDelegated: `${(1_000_000 + i * 250_000).toLocaleString()} STRK`,
  }));
}

function getMockPositions(address: string): StakingPosition[] {
  const seed = parseInt(address.slice(2, 8) || "abc123", 16) % 100;
  if (seed < 30) return []; // ~30% of users have no positions

  const validators = SEPOLIA_VALIDATORS.slice(0, seed < 60 ? 1 : 2);
  return validators.map((v, i) => ({
    poolAddress: v.stakerAddress,
    validatorName: v.name,
    staked: `${(100 + seed * 1.5 + i * 50).toFixed(2)} STRK`,
    rewards: `${(seed * 0.12 + i * 0.05).toFixed(4)} STRK`,
    total: `${(100 + seed * 1.5 + i * 50 + seed * 0.12 + i * 0.05).toFixed(4)} STRK`,
    unpooling: "0 STRK",
    commissionPercent: [10, 5, 8, 7, 6][i],
    apr: MOCK_VALIDATOR_APRS[v.name] ?? 8.0,
  }));
}

export function useStaking(walletAddress: string | null) {
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
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
