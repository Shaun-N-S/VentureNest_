export const SocketRooms = {
  feed: () => "feed:posts",
  post: (postId: string) => `post:${postId}`,
};
