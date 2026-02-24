export interface ShareIssuanceEntity {
  _id?: string;
  projectId: string;
  dealId: string;
  investorId: string;

  sharesIssued: number;
  equityPercentage: number;

  issuedAt: Date;
}
