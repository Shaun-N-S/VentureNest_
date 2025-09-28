import { IEmailContentGenerator } from "domain/interfaces/services/IEmail/IEmailContentGenerator";
import { BaseEmailContentGenerator } from "./baseEmailContentGenerator";

export class OtpEmailContentGenerator
  extends BaseEmailContentGenerator
  implements IEmailContentGenerator
{
  generateTemplate(otp: string): string {
    const body = `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="width:600px; padding:0 20px;">
              <tr>
                <td style="color:#111827; font-size:16px; font-family:Arial, sans-serif; line-height:1.5;">
                  
                  <p style="margin:0 0 20px 0;">
                    To complete your verification on <strong>VentureNest</strong>, please use the One-Time Password (OTP) below:
                  </p>

                  <p style="background-color:#f3f4f6; color:#111827; font-size:28px; font-weight:bold; text-align:center; padding:20px; border:2px dashed #3b82f6; letter-spacing:4px; margin:30px 0;">
                    ${otp}
                  </p>

                  <p style="margin:20px 0 0 0;">
                    This OTP is valid for the next <strong>10 minutes</strong>. For your security, please do not share it with anyone.
                  </p>

                  <p style="margin:30px 0 0 0;">
                    If you didn’t request this, you can safely ignore this email.
                  </p>

                  <p style="margin:30px 0 0 0;">
                    Thanks,<br>
                    <strong>The VentureNest Team 🚀</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    return this.htmlWrapper(body);
  }
}
