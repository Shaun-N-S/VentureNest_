export interface IRejectWithdrawalUseCase {
  execute(withdrawalId: string): Promise<void>;
}
