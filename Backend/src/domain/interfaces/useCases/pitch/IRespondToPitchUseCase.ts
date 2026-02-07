import { PitchDetailsResponseDTO } from "application/dto/pitch/PitchDetailsResponseDTO";

export interface IRespondToPitchUseCase {
  execute(pitchId: string, investorId: string, message: string): Promise<PitchDetailsResponseDTO>;
}
