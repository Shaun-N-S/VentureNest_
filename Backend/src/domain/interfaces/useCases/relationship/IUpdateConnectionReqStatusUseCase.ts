export interface IUpdateConnectionReqStatusUseCase {
  execute(fromUserId: string, toUserId: string, status: string): Promise<boolean>;
}
