import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { GetWalletDetailsResponseDTO } from "application/dto/wallet/getWalletDetailsDTO";

export interface IGetWalletDetailsUseCase {
  execute(params: {
    ownerType: WalletOwnerType;
    ownerId: string;
  }): Promise<GetWalletDetailsResponseDTO>;
}
