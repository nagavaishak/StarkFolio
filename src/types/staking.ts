export interface StakingPool {
  validatorName: string;
  validatorAddress: string;
  poolAddress: string;
  apr: number;
  commissionPercent: number;
  totalDelegated?: string;
}

export interface StakingPosition {
  poolAddress: string;
  validatorName: string;
  staked: string;
  rewards: string;
  total: string;
  unpooling?: string;
  unpoolTime?: Date;
  commissionPercent: number;
  apr?: number;
}
