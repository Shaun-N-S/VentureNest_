import { IReplyModel } from "@infrastructure/db/models/replyModel";

export type PopulatedReply = IReplyModel & {
  user?: { userName: string; profileImg?: string };
};
