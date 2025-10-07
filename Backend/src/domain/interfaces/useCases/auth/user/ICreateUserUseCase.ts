export interface ICreateUserUseCase {
  createUser(email: string): Promise<void>;
}
