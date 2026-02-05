import { PitchDetailsResponseDTO } from "application/dto/pitch/PitchDetailsResponseDTO";

export interface IGetPitchDetailsUseCase {
  execute(pitchId: string, viewerId: string): Promise<PitchDetailsResponseDTO>;
}
