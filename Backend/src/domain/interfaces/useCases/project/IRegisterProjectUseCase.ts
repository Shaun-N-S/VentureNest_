import { CreateProjectRegistrationDTO } from "application/dto/project/projectRegistrationDTO";

export interface IRegisterProjectUseCase {
  registerProject(data: CreateProjectRegistrationDTO): Promise<void>;
}
