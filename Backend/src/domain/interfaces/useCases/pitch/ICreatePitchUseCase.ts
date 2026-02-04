import { SendPitchDTO } from "application/dto/pitch/SendPitchDTO";
import { PitchResponseDTO } from "application/dto/pitch/PitchResponseDTO";

export interface ICreatePitchUseCase {
  execute(data: SendPitchDTO): Promise<PitchResponseDTO>;
}
