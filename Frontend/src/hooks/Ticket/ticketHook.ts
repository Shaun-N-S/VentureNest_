import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createTicketWithSession,
  fetchFounderTickets,
  fetchInvestorTickets,
} from "../../services/Ticket/ticketService";
import type { InvestorTicketDTO } from "../../types/session";

export const useCreateTicketWithSession = () => {
  return useMutation({
    mutationFn: createTicketWithSession,
  });
};

export const useGetInvestorTickets = () => {
  return useQuery<InvestorTicketDTO[]>({
    queryKey: ["investor-tickets"],
    queryFn: fetchInvestorTickets,
  });
};

export const useGetFounderTickets = () => {
  return useQuery<InvestorTicketDTO[]>({
    queryKey: ["founder-tickets"],
    queryFn: fetchFounderTickets,
  });
};
