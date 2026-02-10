export const SocketRooms = {
  feed: () => "feed:posts",

  post: (postId: string) => `post:${postId}`,

  user: (userId: string) => `user:${userId}`,

  conversation: (conversationId: string) => `conversation:${conversationId}`,
};
