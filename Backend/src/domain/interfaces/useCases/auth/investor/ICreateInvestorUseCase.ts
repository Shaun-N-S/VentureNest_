export interface ICreateInvestorUseCase {
  createInvestor(email: string): Promise<void>;
}
