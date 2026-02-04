import { useQuery } from "@tanstack/react-query";
import {
  fetchInvestorTickets,
  fetchFounderTickets,
} from "../../services/Ticket/ticketService";
import type { UserRole } from "../../types/UserRole";
import type { InvestorTicketDTO } from "../../types/session";

export const useMyTickets = (role: UserRole) => {
  return useQuery<InvestorTicketDTO[]>({
    queryKey: ["my-tickets", role],
    queryFn: () =>
      role === "INVESTOR" ? fetchInvestorTickets() : fetchFounderTickets(),
  });
};
