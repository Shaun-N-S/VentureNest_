export interface ITokenInvalidationUseCase {
  refreshToken(token: string): Promise<void>;
}
