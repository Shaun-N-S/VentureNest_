import { useMutation } from "@tanstack/react-query";
import { createPitch } from "../../services/Pitch/pitchService";
import type { CreatePitchPayload, PitchResponse } from "../../types/pitchType";

export const useCreatePitch = () => {
  return useMutation<PitchResponse, Error, CreatePitchPayload>({
    mutationFn: (payload) => createPitch(payload),
  });
};
