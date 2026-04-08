import {
  GetSessionStatusDTO,
  GetSessionStatusResponseDTO,
} from "application/dto/session/GetSessionStatusDTO";

export interface IGetSessionStatusUseCase {
  execute(data: GetSessionStatusDTO): Promise<GetSessionStatusResponseDTO>;
}
