export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  usdValue: number;
  logoUrl?: string;
  address: string;
  isBTC?: boolean;
}

export interface Portfolio {
  totalUsdValue: number;
  tokens: TokenBalance[];
  lastUpdated: Date;
}
