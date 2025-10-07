export interface IRefreshTokenUseCase {
  refresh(token: string): Promise<string>;
}
