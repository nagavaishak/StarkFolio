import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { AI_TOOLS } from "@/lib/ai/tools";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Try models in order — fall back if one hits quota
const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

function buildGeminiTools(): FunctionDeclaration[] {
  return AI_TOOLS.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters:
      tool.parameters.properties &&
      Object.keys(tool.parameters.properties).length > 0
        ? {
            type: SchemaType.OBJECT,
            properties: Object.fromEntries(
              Object.entries(tool.parameters.properties).map(([key, val]) => [
                key,
                {
                  type: SchemaType.STRING,
                  description: (val as { description: string }).description,
                },
              ])
            ),
            required: tool.parameters.required,
          }
        : undefined,
  }));
}

export async function POST(req: NextRequest) {
  const { messages, walletAddress } = await req.json();

  const systemInstruction =
    SYSTEM_PROMPT +
    (walletAddress
      ? `\n\nUser wallet address: ${walletAddress}`
      : "\n\nUser has not connected their wallet yet.");

  // Gemini requires history to start with a user turn — strip leading model messages (e.g. welcome)
  const allHistory = messages
    .slice(0, -1)
    .map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));
  const firstUserIdx = allHistory.findIndex((m: { role: string }) => m.role === "user");
  const history = firstUserIdx >= 0 ? allHistory.slice(firstUserIdx) : [];

  const lastMessage = messages[messages.length - 1];
  let lastError: unknown;

  for (const modelName of MODEL_PRIORITY) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        tools: [{ functionDeclarations: buildGeminiTools() }],
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      const response = result.response;

      const functionCalls = response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        return NextResponse.json({
          type: "tool_call",
          toolName: call.name,
          toolArgs: call.args,
          text: response.text() || "",
          model: modelName,
        });
      }

      return NextResponse.json({
        type: "text",
        text: response.text(),
        model: modelName,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      // Rate limit or quota — try next model
      if (message.includes("429") || message.includes("quota") || message.includes("RESOURCE_EXHAUSTED")) {
        lastError = err;
        console.warn(`[chat] ${modelName} quota hit, trying next model...`);
        continue;
      }
      // Any other error — return immediately
      console.error(`[chat] ${modelName} error:`, err);
      return NextResponse.json(
        { error: "AI agent error. Please try again." },
        { status: 500 }
      );
    }
  }

  console.error("[chat] All models quota-exceeded:", lastError);
  return NextResponse.json(
    {
      error:
        "AI quota temporarily exceeded. The free tier resets every minute — please try again in 60 seconds.",
    },
    { status: 429 }
  );
}
