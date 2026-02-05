import { SentPitchListItemDTO } from "application/dto/pitch/SentPitchListItemDTO";

export interface IGetSentPitchesUseCase {
  execute(founderId: string): Promise<SentPitchListItemDTO[]>;
}
