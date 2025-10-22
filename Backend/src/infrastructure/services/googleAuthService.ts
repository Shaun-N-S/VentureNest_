import { CONFIG } from "@config/config";
import { IGoogleAuthService } from "@domain/interfaces/services/IGoogleAuthService";
import { Errors } from "@shared/constants/error";
import { InvalidDataException } from "application/constants/exceptions";
import { OAuth2Client } from "google-auth-library";

export class GoogleAuthService implements IGoogleAuthService {
  private _oAuth2Client: OAuth2Client;
  constructor() {
    this._oAuth2Client = new OAuth2Client({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      client_secret: CONFIG.GOOGLE_CLIENT_SECERT,
      redirectUri: "postmessage",
    });
  }

  async authorize(
    code: string
  ): Promise<{ email: string; googleId: string; profileImage: string; userName: string }> {
    console.log("reached google auth service");

    const token = await this._oAuth2Client.getToken(code);

    if (!token.tokens.id_token) {
      throw new InvalidDataException(Errors.TOKEN_DATA_MISSING);
    }

    const ticket = await this._oAuth2Client.verifyIdToken({
      idToken: token.tokens.id_token,
      audience: CONFIG.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("payload obtained ", payload);

    if (!(payload?.email && payload.sub && payload.picture && payload.name)) {
      throw new InvalidDataException(Errors.TOKEN_DATA_MISSING);
    }
    return {
      email: payload?.email,
      googleId: payload?.sub,
      profileImage: payload?.picture,
      userName: payload.name,
    };
  }
}
