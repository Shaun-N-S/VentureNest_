export interface IRemoveProjectUseCase {
  removeProject(projectId: string, userId: string): Promise<void>;
}
