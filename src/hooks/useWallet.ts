"use client";

import { useContext } from "react";
import { WalletContext } from "@/components/providers/WalletProvider";

// Reads from WalletContext — safe everywhere in the tree.
// Returns safe defaults (ready:false, authenticated:false) before Privy mounts.
// Returns real Privy values after client-side mount.
export function useWallet() {
  return useContext(WalletContext);
}
