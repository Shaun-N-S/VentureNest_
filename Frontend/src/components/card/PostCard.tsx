import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import type { PostCardProps } from "../../types/PostCardPropsType";
import { MediaCarousel } from "../Carousel/MediaCarousel";
import { useEffect, useRef, useState } from "react";
import {
  CommentSection,
  SingleComment,
  type Comment,
} from "../Comments/CommentSection";
import {
  useAddComment,
  useInfiniteComments,
  useLikeComment,
} from "../../hooks/Comment/commentHooks";
import { useAddReply } from "../../hooks/Reply/replyHooks";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import toast from "react-hot-toast";
import { CommentSkeleton } from "../Skelton/CommentSkelton";
import { getSocket } from "../../lib/socket";

export function PostCard({
  id,
  author,
  timestamp,
  content,
  link,
  mediaUrls,
  likes = 0,
  comments: initialCommentsCount = 0,
  liked = false,
  onLike,
  context,
  onRemove,
  onReport,
}: PostCardProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const { mutate: addComment } = useAddComment();
  const { mutate: addReply } = useAddReply();
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const userData = useSelector((state: Rootstate) => state.authData);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteComments(id, 5, showComments);

  useEffect(() => {
    if (!data) return;

    const formatted = data.pages.flatMap((page) =>
      page.data.comments.map((item) => ({
        id: item._id,
        user: { name: item.userName, avatar: item.userProfileImg },
        text: item.commentText,
        liked: item.liked,
        likes: item.likes,
        repliesCount: item.repliesCount || 0,
        replies: [],
      }))
    );

    setComments(formatted);
    setCommentsCount(data.pages[0].data.total);
  }, [data]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("post:join", id);

    return () => {
      socket.emit("post:leave", id);
    };
  }, [id]);

  const { mutate: likeCommentMutation } = useLikeComment();

  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return;

    const tempId = Date.now().toString();

    const newComment: Comment = {
      id: tempId,
      user: { name: userData.userName, avatar: userData.profileImg },
      text,
      liked: false,
      likes: 0,
      repliesCount: 0,
    };

    setComments((prev) => [...prev, newComment]);
    setCommentsCount((prev) => prev + 1);

    addComment(
      { postId, commentText: text },
      {
        onSuccess: (res) => {
          console.log("add comment response : : : ", res);
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === tempId
                ? { ...comment, id: res?.data?._id }
                : comment
            )
          );
        },
        onError: (err) => {
          console.error("Failed to post comment", err);
          setComments((prev) => prev.filter((c) => c.id !== tempId));
          setCommentsCount((prev) => prev - 1);
        },
      }
    );
  };

  const handleAddReply = (commentId: string, replyText: string) => {
    addReply(
      { commentId, replyText },
      {
        onSuccess: () => {
          setComments((prev) =>
            prev.map((c) =>
              c.id === commentId
                ? { ...c, repliesCount: (c.repliesCount ?? 0) + 1 }
                : c
            )
          );

          toast.success("Reply added");
        },
        onError: () => {
          toast.error("Failed to add reply");
        },
      }
    );
  };

  const handleToggleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );

    likeCommentMutation(commentId);
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-base">{author.name}</h4>
            <p className="text-sm text-gray-500">{timestamp}</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            <MoreVertical className="h-5 w-5" />
          </Button>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-10 bg-white border shadow-lg rounded-md w-40 z-50"
            >
              {context === "home" && (
                <button
                  onClick={() => {
                    onReport?.(id);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-red-600"
                >
                  Report
                </button>
              )}
              {context === "profile" && (
                <button
                  onClick={() => {
                    onRemove?.(id);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-red-600"
                >
                  Remove Post
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-base whitespace-pre-wrap">{content}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            className="text-blue-500 text-sm hover:underline block mt-2"
          >
            {link}
          </a>
        )}
      </div>

      {/* Media */}
      {mediaUrls && mediaUrls.length > 0 && (
        <MediaCarousel mediaUrls={mediaUrls} />
      )}

      {/* Engagement Bar */}
      <div className="px-4 py-3 border-t flex items-center gap-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onLike}
          className={`flex items-center gap-2 font-medium ${liked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
        >
          <Heart className={`h-6 w-6 ${liked ? "fill-red-500" : ""}`} />
          <span>{likes}</span>
        </motion.button>

        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <MessageCircle className="h-6 w-6" />
          <span>{commentsCount}</span>
        </div>
      </div>

      <CommentSection
        postId={id}
        showComments={showComments}
        toggleComments={toggleComments}
        onAddComment={handleAddComment}
      />

      {showComments && (
        <div className="max-h-[320px] overflow-y-auto bg-gray-50 px-4 pb-3">
          {/* Initial loading */}
          {isLoading && (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          )}

          {/* Empty state */}
          {!isLoading && comments.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-6">
              No comments yet. Be the first to comment 💬
            </div>
          )}

          {/* Comment list */}
          {comments.map((c) => (
            <SingleComment
              key={c.id}
              comment={c}
              onToggleLike={handleToggleCommentLike}
              onAddReply={handleAddReply}
            />
          ))}

          {/* Load more */}
          {hasNextPage && (
            <div className="flex justify-center py-4">
              <Button
                variant="ghost"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                className="text-sm text-blue-600"
              >
                {isFetchingNextPage ? "Loading..." : "Load more comments"}
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
