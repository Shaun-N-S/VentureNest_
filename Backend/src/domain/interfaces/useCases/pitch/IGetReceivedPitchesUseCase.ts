import { PitchStatus } from "@domain/enum/pitchStatus";
import { PaginatedResponseDTO } from "application/dto/common/paginatedResponseDTO";
import { ReceivedPitchListItemDTO } from "application/dto/pitch/ReceivedPitchListItemDTO";

export interface IGetReceivedPitchesUseCase {
  execute(
    investorId: string,
    page: number,
    limit: number,
    status?: PitchStatus,
    search?: string
  ): Promise<PaginatedResponseDTO<ReceivedPitchListItemDTO>>;
}
