import { useMutation } from "@tanstack/react-query";
import { createReport } from "../../services/Report/ReportService";
import type { CreateReportPayload } from "../../types/ReportPayload";

export const useCreateReport = () => {
  return useMutation({
    mutationFn: (payload: CreateReportPayload) => createReport(payload),
  });
};
