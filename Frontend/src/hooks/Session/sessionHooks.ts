import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useJoinSession = () => {
  return useMutation({
    mutationFn: (sessionId: string) => sessionService.joinSession(sessionId),
  });
};

export const useApproveUser = () => {
  return useMutation({
    mutationFn: ({
      sessionId,
      userId,
    }: {
      sessionId: string;
      userId: string;
    }) => sessionService.approveUser(sessionId, userId),
  });
};

export const useSessionStatus = (sessionId: string) => {
  return useQuery({
    queryKey: ["session-status", sessionId],
    queryFn: () => sessionService.getSessionStatus(sessionId),
    enabled: !!sessionId,
  });
};
