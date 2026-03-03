"use client";

import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from "lucide-react";

interface ActionCardProps {
  type: "confirm" | "success" | "error" | "info";
  title: string;
  details?: string;
  txHash?: string;
  explorerUrl?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ActionCard({
  type,
  title,
  details,
  txHash,
  explorerUrl,
  onConfirm,
  onCancel,
}: ActionCardProps) {
  const styles = {
    confirm: {
      border: "border-orange-500/30",
      bg: "bg-orange-500/5",
      icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
    },
    success: {
      border: "border-green-500/30",
      bg: "bg-green-500/5",
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
    },
    error: {
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      icon: <XCircle className="w-4 h-4 text-red-400" />,
    },
    info: {
      border: "border-purple-500/30",
      bg: "bg-purple-500/5",
      icon: <AlertTriangle className="w-4 h-4 text-purple-400" />,
    },
  };

  const style = styles[type];

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-3 space-y-2`}>
      <div className="flex items-center gap-2">
        {style.icon}
        <span className="text-sm font-medium text-white">{title}</span>
      </div>

      {details && (
        <p className="text-xs text-gray-400 leading-relaxed">{details}</p>
      )}

      {txHash && (
        <div className="mono text-xs text-gray-500 bg-white/5 rounded-lg px-2 py-1.5 flex items-center justify-between">
          <span>{txHash.slice(0, 16)}...{txHash.slice(-8)}</span>
          {explorerUrl && (
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {type === "confirm" && (onConfirm || onCancel) && (
        <div className="flex gap-2 pt-1">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="flex-1 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-medium transition-colors"
            >
              Confirm
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-1.5 rounded-lg glass text-gray-400 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
