import { PitchEntity } from "@domain/entities/pitch/pitchEntity";
import { IBaseRepository } from "./IBaseRepository";
import { PitchStatus } from "@domain/enum/pitchStatus";
import {
  ReceivedPitchPopulated,
  SentPitchPopulated,
} from "application/dto/pitch/PitchPopulatedTypes";
import {
  InvestorReplyDTO,
  PitchDetailsPopulated,
} from "application/dto/pitch/PitchDetailsResponseDTO";

export interface IPitchRepository extends IBaseRepository<PitchEntity> {
  findSentByFounder(founderId: string): Promise<SentPitchPopulated[]>;
  findReceivedByInvestor(investorId: string): Promise<ReceivedPitchPopulated[]>;
  findDetailsById(pitchId: string): Promise<PitchDetailsPopulated | null>;
  updateStatus(pitchId: string, status: PitchStatus): Promise<PitchEntity | null>;
  respondToPitch(pitchId: string, reply: InvestorReplyDTO): Promise<PitchDetailsPopulated | null>;
}
