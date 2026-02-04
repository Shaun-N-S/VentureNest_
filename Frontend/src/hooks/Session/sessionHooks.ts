import { useMutation } from "@tanstack/react-query";
import type {
  AddSessionFeedbackDTO,
  CancelSessionDTO,
} from "../../types/session";
import { sessionService } from "../../services/Session/sessoinService";

export const useCancelSession = () => {
  return useMutation({
    mutationFn: (payload: CancelSessionDTO) =>
      sessionService.cancelSession(payload.sessionId, payload),
  });
};

export const useAddSessionFeedback = () => {
  return useMutation({
    mutationFn: (payload: AddSessionFeedbackDTO) =>
      sessionService.addSessionFeedback(payload.sessionId, payload),
  });
};
