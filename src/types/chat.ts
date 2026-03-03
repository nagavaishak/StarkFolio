export type MessageRole = "user" | "assistant" | "tool";

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  toolCalls?: ToolCall[];
  timestamp: Date;
  requiresConfirmation?: boolean;
  confirmationData?: {
    action: string;
    details: string;
    onConfirm: () => void;
  };
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
}
