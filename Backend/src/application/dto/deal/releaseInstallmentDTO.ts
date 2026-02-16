export interface ReleaseInstallmentDTO {
  dealId: string;
  amount: number;
  paymentMethod: "WALLET" | "STRIPE";
}
