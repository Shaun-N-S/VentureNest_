import { ICommentModel } from "@infrastructure/db/models/commentModel";

export type PopulatedComment = ICommentModel & {
  user?: {
    userName: string;
    profileImg?: string;
  };
};
