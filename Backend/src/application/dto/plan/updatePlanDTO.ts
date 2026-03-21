export interface UpdatePlanDTO {
  name?: string | undefined;
  description?: string | undefined;

  limits?: {
    projects?: number | undefined;
    proposalsPerMonth?: number | undefined;
    investmentOffers?: number | undefined;
  };

  permissions?: {
    canCreateProject?: boolean | undefined;
    canSendProposal?: boolean | undefined;

    canSendInvestmentOffer?: boolean | undefined;
    canInvestMoney?: boolean | undefined;
    canViewInvestmentDashboard?: boolean | undefined;

    canStartVideoCall?: boolean | undefined;
  };

  billing?: {
    durationDays?: number | undefined;
    price?: number | undefined;
  };
}
