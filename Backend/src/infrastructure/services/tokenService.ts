import { ITokenService } from "@domain/interfaces/services/ITokenService";
import { v4 } from "uuid";

export class TokenSerivce implements ITokenService {
  createToken(): string {
    return v4();
  }
}
