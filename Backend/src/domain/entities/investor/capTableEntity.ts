export interface CapTableEntity {
  _id?: string;
  projectId: string;
  totalShares: number;

  shareholders: {
    userId: string;
    shares: number;
    equityPercentage: number;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}
