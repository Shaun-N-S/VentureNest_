export interface IHashPasswordService {
  hashPassword(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
