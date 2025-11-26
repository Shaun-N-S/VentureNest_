export interface ReplyUI {
  id: string;
  userName: string;
  avatar?: string;
  text: string;
  likes: number;
  liked: boolean;
}

export interface CommentUI {
  id: string;
  userName: string;
  avatar?: string;
  text: string;
  likes: number;
  liked: boolean;
  replies: ReplyUI[];
}
