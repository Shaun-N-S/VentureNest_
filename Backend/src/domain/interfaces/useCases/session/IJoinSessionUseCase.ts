import { JoinSessionDTO, JoinSessionResponseDTO } from "application/dto/session/JoinSessionDTO";

export interface IJoinSessionUseCase {
  execute(data: JoinSessionDTO): Promise<JoinSessionResponseDTO>;
}
