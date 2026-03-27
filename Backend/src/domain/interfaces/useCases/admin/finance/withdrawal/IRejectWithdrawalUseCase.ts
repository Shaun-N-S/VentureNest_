export interface IRejectWithdrawalUseCase {
  execute(withdrawalId: string, reason: string): Promise<void>;
}
