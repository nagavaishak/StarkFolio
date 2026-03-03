"use client";

import { useEffect, useRef } from "react";
import { ChatMessage as ChatMessageComponent } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "@/types/chat";
import { Bot, Sparkles } from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (message: string) => void;
  walletConnected: boolean;
}

export function ChatPanel({ messages, isLoading, onSend, walletConnected }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/30 to-purple-500/30 border border-orange-500/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">StarkFolio AI</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-soft" />
            <p className="text-[10px] text-gray-500">Powered by Gemini Flash</p>
          </div>
        </div>
        <div className="ml-auto">
          <Sparkles className="w-4 h-4 text-orange-400/60" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full flex-shrink-0 bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-orange-400/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} isLoading={isLoading} disabled={!walletConnected} />
    </div>
  );
}
