import type { Plan } from "../types/planType";

type PermissionItem = {
  label: string;
};

export const getPlanPermissions = (
  permissions: Plan["permissions"],
): PermissionItem[] => {
  return [
    permissions.canCreateProject && { label: "Create Project" },
    permissions.canSendProposal && { label: "Send Proposal" },
    permissions.canSendInvestmentOffer && { label: "Send Investment Offer" },
    permissions.canInvestMoney && { label: "Invest Money" },
    permissions.canViewInvestmentDashboard && {
      label: "View Investment Dashboard",
    },
    permissions.canStartVideoCall && { label: "Start Video Call" },
  ].filter(Boolean) as PermissionItem[];
};
