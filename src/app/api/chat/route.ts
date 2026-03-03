import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { AI_TOOLS } from "@/lib/ai/tools";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Convert our tool definitions to Gemini FunctionDeclaration format
function buildGeminiTools(): FunctionDeclaration[] {
  return AI_TOOLS.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters.properties && Object.keys(tool.parameters.properties).length > 0
      ? {
          type: SchemaType.OBJECT,
          properties: Object.fromEntries(
            Object.entries(tool.parameters.properties).map(([key, val]) => [
              key,
              { type: SchemaType.STRING, description: (val as { description: string }).description },
            ])
          ),
          required: tool.parameters.required,
        }
      : undefined,
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { messages, walletAddress } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT + (walletAddress ? `\n\nUser wallet address: ${walletAddress}` : "\n\nUser has not connected their wallet yet."),
      tools: [{ functionDeclarations: buildGeminiTools() }],
    });

    // Build chat history (all messages except last user message)
    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;

    // Check if Gemini wants to call a function
    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      return NextResponse.json({
        type: "tool_call",
        toolName: call.name,
        toolArgs: call.args,
        text: response.text() || "",
      });
    }

    return NextResponse.json({
      type: "text",
      text: response.text(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
