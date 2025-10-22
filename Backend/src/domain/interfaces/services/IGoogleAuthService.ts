export interface IGoogleAuthService {
  authorize(code: string): Promise<{
    email: string;
    googleId: string;
    profileImage: string;
    userName: string;
  }>;
}
