import { IEngagementEventPublisher } from "@domain/interfaces/services/IEngagementEventPublisher";
import { io } from "../socketGateway";

export class SocketEngagementEventPublisher implements IEngagementEventPublisher {
  async publishPostLikeToggled(event: {
    postId: string;
    likerId: string;
    liked: boolean;
    likeCount: number;
  }): Promise<void> {
    console.log("📢 Publishing post:likeToggled event:", event);

    // ✅ Emit to all users in the feed room
    io.to("feed:all-posts").emit("post:likeToggled", {
      postId: event.postId,
      likeCount: event.likeCount,
      likerId: event.likerId,
      liked: event.liked,
    });

    console.log("✅ Event published to feed:all-posts room");
  }
}
