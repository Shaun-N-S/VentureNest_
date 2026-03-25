export interface IApproveWithdrawalUseCase {
  execute(withdrawalId: string): Promise<void>;
}
