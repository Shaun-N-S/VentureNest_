export interface IRemovePostUseCase {
  removePost(postId: string, useId: string): Promise<void>;
}
