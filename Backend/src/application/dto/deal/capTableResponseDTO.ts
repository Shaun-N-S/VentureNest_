export interface ShareholderDTO {
  userId: string;
  shares: number;
  equityPercentage: number;
}

export interface CapTableResponseDTO {
  projectId: string;
  totalShares: number;
  shareholders: ShareholderDTO[];
  createdAt: Date;
  updatedAt: Date;
}
