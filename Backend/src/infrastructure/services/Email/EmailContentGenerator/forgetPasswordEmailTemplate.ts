import { BaseEmailContentGenerator } from "./baseEmailContentGenerator";

export class ForgetPasswordEmailTemplateGenerator extends BaseEmailContentGenerator {
  generateHtml(data: { otp: string }): string {
    const body = `
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); border:1px solid #e5e7eb; padding:32px; text-align:center;">
        <tr>
          <td>
            <h2 style="margin:0 0 16px 0; font-size:22px; font-weight:bold; color:#111827;">
              Reset Your Password
            </h2>
            <p style="margin:0 0 24px 0; font-size:15px; color:#6b7280;">
              We received a request to reset your password. Use the code below to set up a new one.
            </p>
            <div style="background:#f3f4f6; border-radius:8px; padding:16px 20px; margin-bottom:24px;">
              <p style="margin:0; font-size:32px; font-weight:bold; color:#111827; letter-spacing:8px;">
                ${data.otp}
              </p>
            </div>
            <p style="margin:0 0 12px 0; font-size:13px; color:#6b7280;">
              This code is valid for the next 10 minutes.
            </p>
            <p style="margin:0; font-size:13px; color:#6b7280;">
              If you did not request a password reset, you can safely ignore this email.
            </p>
          </td>
        </tr>
      </table>
    `;

    return this.htmlWrapper(body);
  }
}
