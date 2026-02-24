export interface ShareIssuanceResponseDTO {
  projectId: string;
  dealId: string;
  investorId: string;
  sharesIssued: number;
  equityPercentage: number;
  issuedAt: Date;
}
