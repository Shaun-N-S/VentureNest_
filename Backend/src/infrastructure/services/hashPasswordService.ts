import bcrypt from "bcrypt";
import { IHashPasswordService } from "@domain/interfaces/services/IHashPasswordService";
import { CONFIG } from "@config/config";

export class HashPassword implements IHashPasswordService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, CONFIG.BCRYPT_SALT_ROUNDS);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
