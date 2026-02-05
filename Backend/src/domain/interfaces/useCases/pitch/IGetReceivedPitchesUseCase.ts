import { ReceivedPitchListItemDTO } from "application/dto/pitch/ReceivedPitchListItemDTO";

export interface IGetReceivedPitchesUseCase {
  execute(investorId: string): Promise<ReceivedPitchListItemDTO[]>;
}
