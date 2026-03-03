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

    const claims = await privy.verifyAuthToken(authToken);
    const user = await privy.getUser(claims.userId);

    // Get or create embedded wallet
    const wallet = user.linkedAccounts.find(
      (a) => a.type === "wallet" && a.walletClientType === "privy"
    ) as { address?: string } | undefined;

    if (!wallet?.address) {
      return NextResponse.json({ error: "No embedded wallet found" }, { status: 404 });
    }

    return NextResponse.json({
      walletId: wallet.address,
      address: wallet.address,
    });
  } catch (error) {
    console.error("Wallet API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
