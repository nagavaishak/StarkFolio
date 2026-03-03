import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest, NextResponse } from "next/server";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function POST(req: NextRequest) {
  try {
    const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await privy.verifyAuthToken(authToken);

    const { walletId, method, params } = await req.json();

    // Use Privy to sign Starknet transactions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (privy.walletApi.rpc as any)({
      walletId,
      method,
      params,
      caip2: "starknet:SN_SEPOLIA",
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Signing API error:", error);
    return NextResponse.json({ error: "Signing failed" }, { status: 500 });
  }
}
