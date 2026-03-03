// Token registry with CoinGecko IDs for price fetching
export const TOKEN_COINGECKO_IDS: Record<string, string> = {
  STRK: "starknet",
  ETH: "ethereum",
  USDC: "usd-coin",
  USDT: "tether",
  DAI: "dai",
  WBTC: "wrapped-bitcoin",
  LBTC: "lombard-staked-btc",
  tBTC: "tbtc",
  SolvBTC: "solv-btc",
  wstETH: "wrapped-steth",
};

export const BTC_TOKENS = new Set(["WBTC", "LBTC", "tBTC", "SolvBTC"]);

export const TOKEN_LOGOS: Record<string, string> = {
  STRK: "https://assets.coingecko.com/coins/images/26433/small/starknet.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  USDT: "https://assets.coingecko.com/coins/images/325/small/tether.png",
  DAI: "https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png",
  WBTC: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
  LBTC: "https://assets.coingecko.com/coins/images/33535/small/LBTC-token-logo.png",
  tBTC: "https://assets.coingecko.com/coins/images/11224/small/0x18084fba666a33d37592fa2633fd49a74dd93a88.png",
  SolvBTC: "https://assets.coingecko.com/coins/images/34766/small/SolvBTC.png",
  wstETH: "https://assets.coingecko.com/coins/images/18834/small/wstETH.png",
};

// Mock price data for testnet demo (real integration would use an oracle)
export const MOCK_PRICES: Record<string, number> = {
  STRK: 0.38,
  ETH: 3200,
  USDC: 1.0,
  USDT: 1.0,
  DAI: 1.0,
  WBTC: 96000,
  LBTC: 96200,
  tBTC: 95800,
  SolvBTC: 95900,
  wstETH: 3800,
};

// Mock APRs for validators (testnet — not live data)
export const MOCK_VALIDATOR_APRS: Record<string, number> = {
  Karnot: 8.4,
  Argent: 7.9,
  AVNU: 8.1,
  Braavos: 7.7,
  Nethermind: 8.6,
};
