import nodemailer from "nodemailer";
import { IEmailService } from "@domain/interfaces/services/IEmail/IEmailService";
import { CONFIG } from "@config/config";
import { IBaseEmailTemplate } from "@domain/interfaces/services/IEmail/IBaseEmailTemplate";

export class EmailService implements IEmailService {
  private _transporter: nodemailer.Transporter;
  constructor() {
    this._transporter = nodemailer.createTransport(
      {
        service: "gmail",
        auth: {
          user: CONFIG.GOOGLE_MAIL,
          pass: CONFIG.GOOGLE_APP_PASSWORD,
        },
      },
      {
        from: CONFIG.GOOGLE_MAIL,
      }
    );

    this._transporter
      .verify()
      .then(() => console.log("Gmail connection established"))
      .catch((err) => console.error("Gmail connection failed : ", err));
  }

  async sendEmail(email: Required<IBaseEmailTemplate>): Promise<void> {
    try {
      console.log(`Email sent to : ${email.receiverEmail}`);
      await this._transporter.sendMail({
        to: email.receiverEmail,
        subject: email.subject,
        html: email.content,
      });
    } catch (error) {
      console.error("Error while sending email : ", error);
      throw error;
    }
  }
}
