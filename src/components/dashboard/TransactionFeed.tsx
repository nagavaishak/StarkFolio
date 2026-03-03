"use client";

import { ExternalLink, ArrowUpRight, ArrowDownLeft, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getTxUrl } from "@/lib/utils/explorer";

interface Transaction {
  hash: string;
  type: "stake" | "unstake" | "claim" | "transfer" | "swap";
  description: string;
  amount: string;
  timestamp: Date;
  status: "confirmed" | "pending" | "failed";
}

// Mock transactions for demo
function getMockTransactions(address: string): Transaction[] {
  const seed = parseInt(address.slice(2, 8) || "deadbe", 16) % 100;
  if (seed < 20) return [];

  return [
    {
      hash: "0x" + address.slice(2, 14) + "abc123",
      type: "stake",
      description: "Staked STRK with Karnot",
      amount: `${(100 + seed).toFixed(0)} STRK`,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "confirmed",
    },
    {
      hash: "0x" + address.slice(2, 14) + "def456",
      type: "claim",
      description: "Claimed rewards from Argent",
      amount: `${(seed * 0.08).toFixed(4)} STRK`,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "confirmed",
    },
  ];
}

const typeIcons = {
  stake: Zap,
  unstake: ArrowUpRight,
  claim: ArrowDownLeft,
  transfer: ArrowUpRight,
  swap: ArrowUpRight,
};

const typeColors = {
  stake: "text-purple-400",
  unstake: "text-orange-400",
  claim: "text-green-400",
  transfer: "text-blue-400",
  swap: "text-yellow-400",
};

interface TransactionFeedProps {
  walletAddress: string | null;
}

export function TransactionFeed({ walletAddress }: TransactionFeedProps) {
  if (!walletAddress) return null;

  const txs = getMockTransactions(walletAddress);
  if (txs.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Recent Transactions</h3>
      <div className="glass rounded-xl divide-y divide-white/5">
        {txs.map((tx) => {
          const Icon = typeIcons[tx.type];
          return (
            <div key={tx.hash} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ${typeColors[tx.type]}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm text-white">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {tx.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <a
                      href={getTxUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-0.5 text-xs text-gray-600 hover:text-purple-400 transition-colors"
                    >
                      Explorer <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="mono text-sm text-white">{tx.amount}</p>
                <Badge variant={tx.status === "confirmed" ? "green" : tx.status === "pending" ? "orange" : "red"}>
                  {tx.status}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
