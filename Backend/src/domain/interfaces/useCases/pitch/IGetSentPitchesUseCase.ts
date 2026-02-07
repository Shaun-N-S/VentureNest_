import { PitchStatus } from "@domain/enum/pitchStatus";
import { PaginatedResponseDTO } from "application/dto/common/paginatedResponseDTO";
import { SentPitchListItemDTO } from "application/dto/pitch/SentPitchListItemDTO";

export interface IGetSentPitchesUseCase {
  execute(
    founderId: string,
    page: number,
    limit: number,
    status?: PitchStatus,
    search?: string
  ): Promise<PaginatedResponseDTO<SentPitchListItemDTO>>;
}
