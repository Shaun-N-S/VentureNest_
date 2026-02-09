export type WalletType = "PERSONAL" | "PROJECT";

export interface Wallet {
  balance: number;
}

export interface Transaction {
  id: string;
  description: string;
  paymentMethod: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  amount: number;
  createdAt: string;
}
export interface Wallet {
  walletId: string;
  ownerType: "USER" | "INVESTOR" | "PROJECT";
  ownerId: string;

  balance: number;
  availableBalance: number;
  lockedBalance: number;
}
