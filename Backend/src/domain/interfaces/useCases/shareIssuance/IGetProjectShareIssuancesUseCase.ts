import { ProjectShareIssuanceDTO } from "application/dto/investor/shareIssuance/getProjectShareIssuancesDTO";

export interface IGetProjectShareIssuancesUseCase {
  execute(projectId: string): Promise<ProjectShareIssuanceDTO[]>;
}
