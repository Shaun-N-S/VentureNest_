import { WalletOwnerType } from "@domain/enum/walletOwnerType";

export interface GetWalletDetailsResponseDTO {
  walletId: string;
  ownerType: WalletOwnerType;
  ownerId: string;
  balance: number;
  lockedBalance: number;
  availableBalance: number;
}
