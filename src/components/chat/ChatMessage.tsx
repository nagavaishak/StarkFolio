"use client";

import { ChatMessage as ChatMessageType } from "@/types/chat";
import { ToolResultCard } from "./ToolResultCard";
import { clsx } from "clsx";
import { Bot, User, Zap } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={clsx("flex gap-3 slide-up", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={clsx(
          "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5",
          isUser
            ? "bg-purple-500/20 border border-purple-500/30"
            : "bg-orange-500/20 border border-orange-500/30"
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-purple-400" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-orange-400" />
        )}
      </div>

      {/* Content */}
      <div className={clsx("max-w-[82%] space-y-1", isUser ? "items-end" : "items-start")}>
        {/* Message bubble */}
        <div
          className={clsx(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-purple-500/20 text-white border border-purple-500/20 rounded-tr-sm"
              : "glass text-gray-200 rounded-tl-sm"
          )}
        >
          {message.content.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </div>

        {/* Tool result cards */}
        {message.toolCalls?.map((tc, i) =>
          tc.result ? (
            <div key={i} className="w-full">
              <ToolResultCard toolName={tc.name} result={tc.result} />
            </div>
          ) : null
        )}

        {/* Tool call indicator */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="flex items-center gap-1.5 px-1">
            <Zap className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] text-gray-500">
              {message.toolCalls.map((t) => t.name.replace(/_/g, " ")).join(", ")}
            </span>
          </div>
        )}

        <span className="text-[10px] text-gray-600 px-1">
          {message.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
