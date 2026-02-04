import { IPitchRepository } from "@domain/interfaces/repositories/IPitchRepository";
import { IProjectRepository } from "@domain/interfaces/repositories/IProjectRepository";
import { ICreatePitchUseCase } from "@domain/interfaces/useCases/pitch/ICreatePitchUseCase";
import { SendPitchDTO } from "application/dto/pitch/SendPitchDTO";
import { PitchResponseDTO } from "application/dto/pitch/PitchResponseDTO";
import { PitchStatus } from "@domain/enum/pitchStatus";
import { ForbiddenException, NotFoundExecption } from "application/constants/exceptions";
import { Errors, PROJECT_ERRORS } from "@shared/constants/error";
import { PitchMapper } from "application/mappers/pitchMapper";

export class CreatePitchUseCase implements ICreatePitchUseCase {
  constructor(
    private readonly _pitchRepo: IPitchRepository,
    private readonly _projectRepo: IProjectRepository
  ) {}

  async execute(data: SendPitchDTO): Promise<PitchResponseDTO> {
    const project = await this._projectRepo.findById(data.projectId);

    if (!project) {
      throw new NotFoundExecption(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }

    if (project.userId !== data.founderId) {
      throw new ForbiddenException(Errors.NOT_ALLOWED);
    }

    const pitch = await this._pitchRepo.save({
      projectId: data.projectId,
      founderId: data.founderId,
      investorId: data.investorId,
      subject: data.subject,
      message: data.message,
      status: PitchStatus.SENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return PitchMapper.toResponseDTO(pitch);
  }
}
