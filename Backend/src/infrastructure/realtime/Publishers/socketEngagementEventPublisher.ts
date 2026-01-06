import { io } from "../socketServer";
import { SocketRooms } from "../socketRooms";
import { IEngagementEventPublisher } from "@domain/interfaces/services/IEngagementEventPublisher";

export class SocketEngagementPublisher implements IEngagementEventPublisher {
  async publishPostLikeUpdated(data: { postId: string; likeCount: number; actorId: string }) {
    io.to(SocketRooms.feed()).emit("post:like-updated", data);
    io.to(SocketRooms.post(data.postId)).emit("post:like-updated", data);
  }

  async publishPostCommentUpdated(data: { postId: string; commentCount: number }) {
    io.to(SocketRooms.feed()).emit("post:comment-updated", data);
    io.to(SocketRooms.post(data.postId)).emit("post:comment-updated", data);
  }
}
