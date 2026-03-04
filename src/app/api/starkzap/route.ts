import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side StarkZap SDK integration for reading live on-chain data.
 * Uses real Starknet Sepolia RPC — no wallet signing required for reads.
 */
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    const { StarkSDK, sepoliaTokens, sepoliaValidators, Staking, Erc20, fromAddress } =
      await import("starkzap");

    const sdk = new StarkSDK({ network: "sepolia" });
    const provider = sdk.getProvider();

    // Minimal read-only wallet proxy — SDK reads only use wallet.address
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const readWallet = { address: fromAddress(address) } as any;

    // Staking contract on Starknet Sepolia (from starkzap stakingPresets.SN_SEPOLIA)
    const stakingConfig = {
      contract: fromAddress("0x03745ab04a431fc02871a139be6b93d9260b0ff3e779ad9c8b377183b23109f1"),
    };

    // ── Read ERC20 balances ────────────────────────────────────────────────────
    const tokenList = [sepoliaTokens.ETH, sepoliaTokens.STRK, sepoliaTokens.USDC];

    const balanceSettled = await Promise.allSettled(
      tokenList.map(async (token) => {
        const erc20 = new Erc20(token, provider);
        const amount = await erc20.balanceOf(readWallet);
        return {
          symbol: token.symbol as string,
          name: token.name as string,
          balance: amount.toUnit(),
          formatted: amount.toFormatted(),
          decimals: token.decimals as number,
          tokenAddress: token.address as string,
        };
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const balances: any[] = balanceSettled
      .filter((r) => r.status === "fulfilled")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((r) => (r as PromiseFulfilledResult<any>).value);

    // ── Read staking positions ─────────────────────────────────────────────────
    const validators = [
      sepoliaValidators.NETHERMIND,
      sepoliaValidators.CHORUS_ONE,
      sepoliaValidators.CUMULO,
      sepoliaValidators.TEKU,
    ];

    const positionSettled = await Promise.allSettled(
      validators.map(async (v) => {
        const staking = await Staking.fromStaker(
          fromAddress(v.stakerAddress),
          sepoliaTokens.STRK,
          provider,
          stakingConfig
        );
        const pos = await staking.getPosition(readWallet);
        if (!pos) return null;
        return {
          validatorName: v.name as string,
          poolAddress: staking.poolAddress as string,
          staked: pos.staked.toUnit(),
          stakedFormatted: pos.staked.toFormatted(),
          rewards: pos.rewards.toUnit(),
          rewardsFormatted: pos.rewards.toFormatted(),
          unpooling: pos.unpooling.toUnit(),
          commissionPercent: pos.commissionPercent,
          unpoolTime: pos.unpoolTime?.toISOString() ?? null,
        };
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const positions: any[] = positionSettled
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((r) => (r as PromiseFulfilledResult<any>).value);

    return NextResponse.json({ balances, positions, live: true });
  } catch (error) {
    console.error("[starkzap] on-chain read error:", error);
    return NextResponse.json(
      { error: "Failed to read on-chain data", live: false },
      { status: 500 }
    );
  }
}
