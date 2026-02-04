export interface ISessionCreatedEmailContentGenerator {
  generateHtml(data: {
    founderName: string;
    projectName: string;
    sessionName: string;
    date: Date;
    duration: number;
  }): string;
}
