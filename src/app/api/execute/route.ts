import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest, NextResponse } from "next/server";
import { StarkZap, OnboardStrategy, Amount, sepoliaTokens, fromAddress } from "starkzap";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

const EXPLORER = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://sepolia.voyager.online";

// Pool address → validator name map (sepoliaValidators)
const VALIDATOR_NAMES: Record<string, string> = {
  "0x0798b587e3da417796a56cbc43e4ae1a2804da6751b4e5c5fda476543bfc9e69": "Nethermind",
  "0x04d6b694c7fdb1a7fc16c95e7aca18e6558ba7a4a1b44a2ad5a5a4c3e0eb9a0": "Chorus One",
  "0x05d8eff0e43e6d21a9aaef2da2ae4abeba69748c1cfc2b17dc7e79d3049dc9d6": "Cumulo",
  "0x07c251045154318a2e56ab89af083e53e719deb8b0c0d9f8cd6d83e2e3d8a4a9": "Teku",
  "0x06b4e97f4c4cf5b17bc23e8d8a3c0e4d9b8c2f3a6e1d7c5b9a4f2e8d6c3b1a0": "Moonli.me",
};

export async function POST(req: NextRequest) {
  const authToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const claims = await privy.verifyAuthToken(authToken);
    const user = await privy.getUser(claims.userId);

    // Find the Privy embedded Starknet wallet
    const embeddedWallet = user.linkedAccounts.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any) => a.type === "wallet" && a.walletClientType === "privy"
    ) as { id?: string; address?: string; publicKey?: string } | undefined;

    if (!embeddedWallet?.id || !embeddedWallet?.publicKey) {
      return NextResponse.json(
        { error: "No Privy embedded wallet found. Please sign in first." },
        { status: 404 }
      );
    }

    const { operation, params } = await req.json() as {
      operation: string;
      params: Record<string, string>;
    };

    const walletId = embeddedWallet.id;
    const publicKey = embeddedWallet.publicKey;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://starkfolio-umber.vercel.app";

    // Create StarkZap wallet with Privy signer
    const sdk = new StarkZap({ network: "sepolia" });
    const { wallet } = await sdk.onboard({
      strategy: OnboardStrategy.Privy,
      deploy: "if_needed",
      privy: {
        resolve: async () => ({
          walletId,
          publicKey,
          serverUrl: `${appUrl}/api/wallet/sign`,
          // Pass auth token to the sign endpoint
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      },
    });

    let result: Record<string, unknown>;

    switch (operation) {
      case "stake": {
        const { pool_address, amount } = params;
        const validatorName = VALIDATOR_NAMES[pool_address] || "Validator";
        const tx = await wallet.stake(fromAddress(pool_address), Amount.parse(amount, sepoliaTokens.STRK));
        await tx.wait();
        result = {
          status: "confirmed",
          operation: "stake",
          validator: validatorName,
          amount: `${amount} STRK`,
          txHash: tx.hash,
          explorerUrl: tx.explorerUrl,
          feeMode: "sponsored",
          note: "Gasless via AVNU Paymaster",
        };
        break;
      }

      case "claim_rewards": {
        const { pool_address } = params;
        const validatorName = VALIDATOR_NAMES[pool_address] || "Validator";
        const tx = await wallet.claimPoolRewards(fromAddress(pool_address));
        await tx.wait();
        result = {
          status: "confirmed",
          operation: "claim_rewards",
          validator: validatorName,
          txHash: tx.hash,
          explorerUrl: tx.explorerUrl,
          feeMode: "sponsored",
          note: "Gasless via AVNU Paymaster",
        };
        break;
      }

      case "transfer": {
        const { token_symbol, amount, recipient } = params;
        const token = sepoliaTokens[token_symbol as keyof typeof sepoliaTokens];
        if (!token) {
          return NextResponse.json({ error: `Unknown token: ${token_symbol}` }, { status: 400 });
        }
        const tx = await wallet.transfer(token, [
          { to: fromAddress(recipient), amount: Amount.parse(amount, token) },
        ]);
        await tx.wait();
        result = {
          status: "confirmed",
          operation: "transfer",
          token: token_symbol,
          amount,
          recipient,
          txHash: tx.hash,
          explorerUrl: tx.explorerUrl,
          feeMode: "sponsored",
          note: "Gasless via AVNU Paymaster",
        };
        break;
      }

      case "exit_pool": {
        const { pool_address, amount } = params;
        const validatorName = VALIDATOR_NAMES[pool_address] || "Validator";
        const tx = await wallet.exitPoolIntent(
          fromAddress(pool_address),
          Amount.parse(amount, sepoliaTokens.STRK)
        );
        await tx.wait();
        const cooldownEnd = new Date();
        cooldownEnd.setDate(cooldownEnd.getDate() + 21);
        result = {
          status: "confirmed",
          operation: "exit_intent",
          validator: validatorName,
          amount: `${amount} STRK`,
          cooldownEnds: cooldownEnd.toLocaleDateString(),
          txHash: tx.hash,
          explorerUrl: tx.explorerUrl,
          note: "21-day cooldown started. Gasless via AVNU.",
        };
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown operation: ${operation}` }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[execute] Error:", msg);
    // Return meaningful error so UI can fall back gracefully
    return NextResponse.json(
      { error: msg, fallback: true },
      { status: 500 }
    );
  }
}
