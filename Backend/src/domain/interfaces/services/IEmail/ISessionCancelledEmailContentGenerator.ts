export interface ISessionCancelledEmailContentGenerator {
  generateHtml(data: {
    receiverName: string;
    projectName: string;
    sessionName: string;
    cancelledBy: "INVESTOR" | "USER";
    reason: string;
    date: Date;
  }): string;
}
