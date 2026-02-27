import { WalletEntity } from "@domain/entities/wallet/walletEntity";
import { AdminPlatformWalletDTO } from "application/dto/admin/adminPlatformWalletDTO";

export class AdminPlatformWalletMapper {
  static toDTO(wallet: WalletEntity): AdminPlatformWalletDTO {
    return {
      walletId: wallet._id!,
      balance: wallet.balance,
      lockedBalance: wallet.lockedBalance,
      totalAvailableBalance: wallet.balance - wallet.lockedBalance,
    };
  }
}
