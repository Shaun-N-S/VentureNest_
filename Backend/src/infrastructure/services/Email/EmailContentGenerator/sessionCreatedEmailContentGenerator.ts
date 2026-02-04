import { ISessionCreatedEmailContentGenerator } from "@domain/interfaces/services/IEmail/ISessionCreatedEmailTemplate";
import { BaseEmailContentGenerator } from "./baseEmailContentGenerator";

export class SessionCreatedEmailContentGenerator
  extends BaseEmailContentGenerator
  implements ISessionCreatedEmailContentGenerator
{
  generateHtml(data: {
    founderName: string;
    projectName: string;
    sessionName: string;
    date: Date;
    duration: number;
  }): string {
    const body = `
      <table width="100%" cellpadding="0" cellspacing="0"
        style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:12px;padding:32px;">
        <tr>
          <td>
            <h2>New Session Scheduled 🚀</h2>

            <p>Hello <strong>${data.founderName}</strong>,</p>

            <p>
              An investor has scheduled a new session for your project
              <strong>${data.projectName}</strong>.
            </p>

            <ul>
              <li><strong>Session:</strong> ${data.sessionName}</li>
              <li><strong>Date:</strong> ${data.date.toDateString()}</li>
              <li><strong>Duration:</strong> ${data.duration} minutes</li>
            </ul>

            <p>Please log in to VentureNest to view more details.</p>

            <p>
              Regards,<br/>
              <strong>VentureNest Team 🚀</strong>
            </p>
          </td>
        </tr>
      </table>
    `;

    return this.htmlWrapper(body);
  }
}
