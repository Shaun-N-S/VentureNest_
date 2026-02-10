import { IGetWalletDetailsUseCase } from "@domain/interfaces/useCases/wallet/IGetWalletDetailsUseCase";
import { IWalletRepository } from "@domain/interfaces/repositories/IWalletRepository";
import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { WalletMapper } from "application/mappers/walletMapper";
import { NotFoundExecption } from "application/constants/exceptions";
import { WALLET_ERRORS } from "@shared/constants/error";

export class GetWalletDetailsUseCase implements IGetWalletDetailsUseCase {
  constructor(private _walletRepository: IWalletRepository) {}

  async execute(params: { ownerType: WalletOwnerType; ownerId: string }) {
    const { ownerType, ownerId } = params;

    const wallet = await this._walletRepository.findByOwner(ownerType, ownerId);

    if (!wallet) {
      throw new NotFoundExecption(WALLET_ERRORS.NOT_FOUND);
    }

    return WalletMapper.toWalletDetailsDTO(wallet);
  }
}
