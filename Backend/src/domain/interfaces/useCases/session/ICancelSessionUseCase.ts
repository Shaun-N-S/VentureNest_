import { CancelSessionDTO } from "application/dto/session/CancelSessionDTO";
import { CancelledSessionResponseDTO } from "application/dto/session/CancelledSessionResponseDTO";

export interface ICancelSessionUseCase {
  execute(data: CancelSessionDTO): Promise<CancelledSessionResponseDTO>;
}
