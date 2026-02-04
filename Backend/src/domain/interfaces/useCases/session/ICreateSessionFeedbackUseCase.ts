import { AddSessionFeedbackDTO } from "application/dto/session/AddSessionFeedbackDTO";
import { SessionFeedbackResponseDTO } from "application/dto/session/SessionFeedbackResponseDTO";

export interface ICreateSessionFeedbackUseCase {
  execute(data: AddSessionFeedbackDTO): Promise<SessionFeedbackResponseDTO>;
}
