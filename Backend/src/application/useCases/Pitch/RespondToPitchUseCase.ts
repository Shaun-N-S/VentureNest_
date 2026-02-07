import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { IRespondToPitchUseCase } from "@domain/interfaces/useCases/pitch/IRespondToPitchUseCase";
import { PitchStatus } from "@domain/enum/pitchStatus";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { Errors, PITCH_ERRORS } from "@shared/constants/error";
import { PitchMapper } from "application/mappers/pitchMapper";

export class RespondToPitchUseCase implements IRespondToPitchUseCase {
  constructor(private readonly _pitchRepo: IPitchRepository) {}

  async execute(pitchId: string, investorId: string, message: string) {
    const pitch = await this._pitchRepo.findDetailsById(pitchId);

    if (!pitch) {
      throw new NotFoundExecption(PITCH_ERRORS.NOT_FOUND);
    }

    if (pitch.investorId._id.toString() !== investorId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    if (pitch.status === PitchStatus.RESPONDED) {
      throw new ForbiddenException(PITCH_ERRORS.ALREADY_RESPONDED);
    }

    const updated = await this._pitchRepo.respondToPitch(pitchId, {
      message,
      repliedAt: new Date(),
    });

    return PitchMapper.toPitchDetailsDTO(updated!);
  }
}
