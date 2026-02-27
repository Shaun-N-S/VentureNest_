import { ShareIssuanceEntity } from "@domain/entities/investor/shareIssuanceEntity";
import { ProjectShareIssuanceDTO } from "application/dto/investor/shareIssuance/getProjectShareIssuancesDTO";

export class ProjectShareIssuanceMapper {
  static toDTO(entity: ShareIssuanceEntity, investorName: string): ProjectShareIssuanceDTO {
    return {
      issuanceId: entity._id!,
      dealId: entity.dealId,
      investorId: entity.investorId,
      investorName,
      sharesIssued: entity.sharesIssued,
      equityPercentage: entity.equityPercentage,
      issuedAt: entity.issuedAt,
    };
  }
}
