import { BaseEmailContentGenerator } from "./baseEmailContentGenerator";
import { ISessionCancelledEmailContentGenerator } from "@domain/interfaces/services/IEmail/ISessionCancelledEmailContentGenerator";

export class SessionCancelledEmailContentGenerator
  extends BaseEmailContentGenerator
  implements ISessionCancelledEmailContentGenerator
{
  generateHtml(data: {
    receiverName: string;
    projectName: string;
    sessionName: string;
    cancelledBy: "INVESTOR" | "USER";
    reason: string;
    date: Date;
  }): string {
    const cancelledByText = data.cancelledBy === "INVESTOR" ? "Investor" : "Founder";

    const body = `
      <table width="100%" cellpadding="0" cellspacing="0"
        style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:12px;padding:32px;">
        <tr>
          <td>
            <h2>Session Cancelled ❌</h2>

            <p>Hello <strong>${data.receiverName}</strong>,</p>

            <p>
              The following session for the project
              <strong>${data.projectName}</strong> has been cancelled by the
              <strong>${cancelledByText}</strong>.
            </p>

            <ul>
              <li><strong>Session:</strong> ${data.sessionName}</li>
              <li><strong>Date:</strong> ${data.date.toDateString()}</li>
              <li><strong>Reason:</strong> ${data.reason}</li>
            </ul>

            <p>
              You can log in to VentureNest for further details.
            </p>

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
