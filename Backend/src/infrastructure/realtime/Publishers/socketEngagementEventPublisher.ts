import { IEngagementEventPublisher } from "@domain/interfaces/services/IEngagementEventPublisher";
import { io } from "../socketGateway";

export class SocketEngagementEventPublisher implements IEngagementEventPublisher {
  async publishPostLikeToggled(event: {
    postId: string;
    likerId: string;
    liked: boolean;
    likeCount: number;
  }): Promise<void> {
    io.to("feed:all-posts").emit("post:likeToggled", {
      postId: event.postId,
      likeCount: event.likeCount,
    });
  }
}
