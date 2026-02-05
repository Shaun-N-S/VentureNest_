import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createPitch,
  fetchReceivedPitches,
  fetchSentPitches,
  respondToPitch,
} from "../../services/Pitch/pitchService";
import type {
  CreatePitchPayload,
  PitchDetailsResponse,
  PitchResponse,
  ReceivedPitchListItem,
  RespondPitchPayload,
  SentPitchListItem,
} from "../../types/pitchType";
import { queryClient } from "../../main";

export const useCreatePitch = () => {
  return useMutation<PitchResponse, Error, CreatePitchPayload>({
    mutationFn: (payload) => createPitch(payload),
  });
};

export const useFetchReceivedPitches = () => {
  return useQuery<ReceivedPitchListItem[]>({
    queryKey: ["received-pitches"],
    queryFn: fetchReceivedPitches,
  });
};

export const useFetchSentPitches = () => {
  return useQuery<SentPitchListItem[]>({
    queryKey: ["sent-pitches"],
    queryFn: fetchSentPitches,
  });
};

export const useRespondToPitch = () => {
  return useMutation<PitchDetailsResponse, Error, RespondPitchPayload>({
    mutationFn: respondToPitch,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pitch-details", variables.pitchId],
      });
      queryClient.invalidateQueries({ queryKey: ["received-pitches"] });
      queryClient.invalidateQueries({ queryKey: ["sent-pitches"] });
    },
  });
};
