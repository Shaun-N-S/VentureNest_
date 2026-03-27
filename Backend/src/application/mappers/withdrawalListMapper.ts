import { PopulatedWithdrawal } from "@infrastructure/types/populatedWithdrawal";
import { WithdrawalListItemDTO } from "application/dto/wallet/getWithdrawalsDTO";

export class WithdrawalListMapper {
  static toDTO(doc: PopulatedWithdrawal): WithdrawalListItemDTO {
    return {
      withdrawalId: doc._id.toString(),
      amount: doc.amount,
      status: doc.status,
      requestReason: doc.requestReason,
      ...(doc.rejectionReason && {
        rejectionReason: doc.rejectionReason,
      }),
      createdAt: doc.createdAt,

      project: doc.projectId
        ? {
            startupName: doc.projectId.startupName,
            logoUrl: doc.projectId.logoUrl ?? undefined,
            founder: doc.projectId.userId
              ? {
                  userName: doc.projectId.userId.userName,
                  ...(doc.projectId.userId.profileImg && {
                    profileImg: doc.projectId.userId.profileImg,
                  }),
                }
              : null,
          }
        : null,
    };
  }
}
