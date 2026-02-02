export interface UpdatePlanDTO {
  name?: string | undefined;
  description?: string | undefined;

  limits?:
    | {
        projects?: number | undefined;
        proposalsPerMonth?: number | undefined;
        meetingRequests?: number | undefined;
        investmentOffers?: number | undefined;
        activeInvestments?: number | undefined;
      }
    | undefined;

  permissions?:
    | {
        canCreateProject?: boolean | undefined;
        canSendProposal?: boolean | undefined;
        canRequestMeeting?: boolean | undefined;

        canSendInvestmentOffer?: boolean | undefined;
        canInvestMoney?: boolean | undefined;
        canViewInvestmentDashboard?: boolean | undefined;
      }
    | undefined;

  billing?:
    | {
        durationDays?: number | undefined;
        price?: number | undefined;
      }
    | undefined;
}
