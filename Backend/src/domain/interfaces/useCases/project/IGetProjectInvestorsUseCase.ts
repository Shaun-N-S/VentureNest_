import {
  GetProjectInvestorsRequestDTO,
  GetProjectInvestorsResponseDTO,
} from "application/dto/project/projectInvestorDTO";

export interface IGetProjectInvestorsUseCase {
  execute(request: GetProjectInvestorsRequestDTO): Promise<GetProjectInvestorsResponseDTO>;
}
