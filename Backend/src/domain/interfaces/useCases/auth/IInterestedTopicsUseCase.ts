import { PreferredSector } from "@domain/enum/preferredSector";

export interface IInterestedTopicsUseCase {
  setTopics(id: string, topics: PreferredSector[]): Promise<void>;
}
