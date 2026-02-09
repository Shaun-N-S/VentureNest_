import { WalletOwnerType } from "@domain/enum/walletOwnerType";
import { IInvestorRepository } from "@domain/interfaces/repositories/IInvestorRespository";
import { IKeyValueTTLCaching } from "@domain/interfaces/services/ICache/IKeyValueTTLCaching";
import { ICreateInvestorUseCase } from "@domain/interfaces/useCases/auth/investor/ICreateInvestorUseCase";
import { ICreateWalletUseCase } from "@domain/interfaces/useCases/wallet/ICreateWalletUseCase";
import { INVESTOR_ERRORS } from "@shared/constants/error";
import { redisRegisterSchema } from "@shared/validations/userRegisterValidator";
import { AlreadyExisitingExecption } from "application/constants/exceptions";
import { InvestorMapper } from "application/mappers/investorMapper";

export class RegisterInvestorUseCase implements ICreateInvestorUseCase {
  constructor(
    private _investorRepository: IInvestorRepository,
    private _cacheStorage: IKeyValueTTLCaching,
    private _createWalletUseCase: ICreateWalletUseCase
  ) {}

  async createInvestor(email: string): Promise<void> {
    const existingInvestor = await this._investorRepository.findByEmail(email);
    if (existingInvestor) {
      throw new AlreadyExisitingExecption(INVESTOR_ERRORS.INVESTOR_ALREADY_EXISTS);
    }

    const redisInvestorData = await this._cacheStorage.getData(`USERDATA/${email}`);
    const investorData = redisRegisterSchema.safeParse(JSON.parse(redisInvestorData!));

    const investorEntity = InvestorMapper.toEntity(investorData.data!);

    const savedInvestor = await this._investorRepository.save(investorEntity);

    await this._createWalletUseCase.execute(WalletOwnerType.INVESTOR, savedInvestor._id!);
  }
}
