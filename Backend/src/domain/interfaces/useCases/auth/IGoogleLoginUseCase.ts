import {
  IGoogleLoginRequestDTO,
  IGoogleLoginResponseDTO,
} from "../../../../application/dto/auth/googleAuthDTO";

export interface IGoogleLoginUseCase {
  execute(dto: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO>;
}
