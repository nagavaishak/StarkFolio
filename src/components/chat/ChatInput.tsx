"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const QUICK_PROMPTS = [
  "What's my portfolio?",
  "Best yield for STRK?",
  "Claim all rewards",
];

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-white/5 p-3 space-y-2">
      {/* Quick prompts */}
      <div className="flex gap-2 flex-wrap">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => { setValue(prompt); textareaRef.current?.focus(); }}
            disabled={isLoading || disabled}
            className="text-xs px-2.5 py-1 rounded-full glass text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-40"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2">
        <div className="flex-1 glass rounded-xl px-3 py-2 focus-within:border-purple-500/40 transition-colors">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={disabled ? "Connect wallet to start…" : "Message StarkFolio AI…"}
            disabled={isLoading || disabled}
            rows={1}
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 resize-none outline-none leading-relaxed disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading || disabled}
          className="w-9 h-9 flex-shrink-0 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
      <p className="text-[10px] text-gray-600 text-center">
        All transactions are gasless via AVNU Paymaster · Starknet Sepolia
      </p>
    </div>
  );
}
