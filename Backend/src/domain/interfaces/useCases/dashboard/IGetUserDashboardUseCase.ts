import { UserDashboardResponseDTO } from "application/dto/dashboard/userDashboardDTO";

export interface IGetUserDashboardUseCase {
  execute(userId: string): Promise<UserDashboardResponseDTO>;
}
