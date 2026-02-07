import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  createPitch,
  fetchPitchById,
  fetchReceivedPitches,
  fetchSentPitches,
  respondToPitch,
} from "../../services/Pitch/pitchService";
import type {
  CreatePitchPayload,
  PitchDetailsResponse,
  PitchResponse,
  RespondPitchPayload,
} from "../../types/pitchType";
import { queryClient } from "../../main";

export const useCreatePitch = () => {
  return useMutation<PitchResponse, Error, CreatePitchPayload>({
    mutationFn: (payload) => createPitch(payload),
  });
};

export const useFetchReceivedPitches = (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  return useQuery({
    queryKey: ["received-pitches", page, limit, status, search],
    queryFn: () => fetchReceivedPitches(page, limit, status, search),
    placeholderData: keepPreviousData,
  });
};

export const useFetchSentPitches = (
  page = 1,
  limit = 10,
  status?: string,
  search?: string,
) => {
  return useQuery({
    queryKey: ["sent-pitches", page, limit, status, search],
    queryFn: () => fetchSentPitches(page, limit, status, search),
    placeholderData: keepPreviousData,
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

export const useFetchPitchDetails = (pitchId?: string) =>
  useQuery<PitchDetailsResponse>({
    queryKey: ["pitch-details", pitchId],
    queryFn: () => fetchPitchById(pitchId!),
    enabled: !!pitchId,
  });
