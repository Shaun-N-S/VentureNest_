export abstract class BaseEmailContentGenerator {
  generateHeader(): string {
    return `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="width:600px; padding:0 20px;">
              <tr>
                <td align="center" style="padding:20px 0;">
                  <h1 style="margin:0; font-size:24px; font-family:Arial, sans-serif; color:#2563eb;">
                    🚀 VentureNest
                  </h1>
                  <p style="margin:5px 0 0; font-size:14px; color:#6b7280;">
                    Empowering Entrepreneurs & Startups
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  }

  generateFooter(): string {
    return `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-top:1px solid #e5e7eb; padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="width:600px;">
              <tr>
                <td align="center" style="padding:10px 20px;">
                  <p style="font-size:12px; color:#9ca3af; margin:0;">
                    &copy; 2025 VentureNest. All rights reserved.
                  </p>
                  <p style="font-size:12px; color:#9ca3af; margin:5px 0 0;">
                    <a href="#" style="color:#2563eb; text-decoration:none;">Privacy Policy</a> &nbsp;|&nbsp; 
                    <a href="#" style="color:#2563eb; text-decoration:none;">Contact Us</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  }

  htmlWrapper(body: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>VentureNest</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
          ${this.generateHeader()}
          ${body}
          ${this.generateFooter()}
        </body>
      </html>
    `;
  }
}
