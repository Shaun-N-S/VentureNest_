import { io } from "../socketServer";
import { SocketRooms } from "../socketRooms";
import { IEngagementEventPublisher } from "@domain/interfaces/services/IEngagementEventPublisher";

export class SocketEngagementPublisher implements IEngagementEventPublisher {
  async publishPostLikeUpdated(data: {
    postId: string;
    likeCount: number;
    actorId: string;
    liked: boolean;
  }) {
    if (!io) return;

    const payload = {
      postId: data.postId,
      likeCount: data.likeCount,
      actorId: data.actorId,
      liked: data.liked,
    };

    io.to(SocketRooms.feed()).emit("post:like-updated", payload);

    io.to(SocketRooms.post(data.postId)).emit("post:like-updated", payload);
  }

  async publishPostCommentUpdated(data: { postId: string; commentCount: number }) {
    if (!io) return;

    const payload = {
      postId: data.postId,
      commentCount: data.commentCount,
    };

    io.to(SocketRooms.feed()).emit("post:comment-updated", payload);
    io.to(SocketRooms.post(data.postId)).emit("post:comment-updated", payload);
  }
}
