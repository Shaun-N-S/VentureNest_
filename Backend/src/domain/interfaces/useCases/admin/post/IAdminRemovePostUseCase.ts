export interface IAdminRemovePostUseCase {
  execute(postId: string): Promise<{ isActive: boolean }>;
}
