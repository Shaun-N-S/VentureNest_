import { Heart, MessageCircle, MoreVertical } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import type { PostCardProps } from "../../types/PostCardPropsType"
import { MediaCarousel } from "../Carousel/MediaCarousel"
import { useEffect, useRef, useState } from "react"
import { CommentSection, type Comment } from "../Comments/CommentSection"
import { useAddComment, useGetAllComments, useLikeComment } from "../../hooks/Comment/commentHooks"
import type { CommentApiResponse } from "../../types/commentApiResponse"
import { useAddReply } from "../../hooks/Reply/replyHooks"
import { queryClient } from "../../main"

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

    // Local state for likes
    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(likes);
    const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
    const { mutate: addComment } = useAddComment()
    const { mutate: addReply } = useAddReply()
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: commentData, isLoading, refetch } = useGetAllComments(id, page, limit, {
        enabled: false
    });

    const { mutate: likeCommentMutation } = useLikeComment();

    useEffect(() => {
        if (showComments && commentData?.comments) {
            const formatted = commentData.comments.map((item: CommentApiResponse) => ({
                id: item._id,
                user: { name: item.userName, avatar: item.userProfileImg },
                text: item.commentText,
                liked: false,
                likes: item.likes,
                repliesCount: item.repliesCount || 0,
                replies: [],
            }));

            setComments(formatted);
            setCommentsCount(commentData.total);
        }
    }, [showComments, commentData]);


    const handleLike = () => {
        // Optimistic UI
        setIsLiked(prev => !prev);
        setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));

        // Ask parent to update with backend result
        onLike?.((liked: boolean, count: number) => {
            setIsLiked(liked);
            setLikeCount(count);
        });
    };


    const handleAddComment = (postId: string, text: string) => {
        if (!text.trim()) return;

        const tempId = Date.now().toString();

        const newComment: Comment = {
            id: tempId,
            user: { name: "You", avatar: "/your-avatar.jpg" },
            text,
            liked: false,
            likes: 0,
            replies: [],
        };

        setComments(prev => [...prev, newComment]);
        setCommentsCount(prev => prev + 1);

        addComment(
            { postId, commentText: text },
            {
                onSuccess: (res) => {
                    setComments(prev =>
                        prev.map(comment =>
                            comment.id === tempId ? { ...comment, id: res._id } : comment
                        )
                    );
                },
                onError: (err) => {
                    console.error("Failed to post comment", err);
                    setComments(prev => prev.filter(c => c.id !== tempId));
                    setCommentsCount(prev => prev - 1);
                },
            }
        );
    };

    const handleAddReply = (commentId: string, replyText: string) => {
        if (!replyText.trim()) return;

        addReply(
            { commentId, replyText },
            {
                onSuccess: (res) => {
                    console.log("Reply successfully stored:", res);
                    queryClient.invalidateQueries({ queryKey: ["comments", id, page] })
                    queryClient.invalidateQueries({ queryKey: ["replies", commentId, page, limit] })
                },
                onError: (err) => {
                    console.error("Error while adding reply:", err);
                },
            }
        );
    };

    const toggleComments = () => {
        setShowComments(prev => {
            const next = !prev;
            if (next) refetch();
            return next;
        });
    };

    const handleToggleCommentLike = (commentId: string) => {

        setComments(prev => toggleLike(prev, commentId));

        likeCommentMutation(commentId, {
            onSuccess: (res) => {
                const { liked, likeCount } = res.data;

                setComments(prev =>
                    prev.map(comment =>
                        comment.id === commentId
                            ? { ...comment, liked, likes: likeCount }
                            : comment
                    )
                );
            },

            onError: () => {
                setComments(prev => toggleLike(prev, commentId));
            }
        });
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
                    <a href={link} target="_blank" className="text-blue-500 text-sm hover:underline block mt-2">
                        {link}
                    </a>
                )}
            </div>

            {/* Media */}
            {mediaUrls && mediaUrls.length > 0 && <MediaCarousel mediaUrls={mediaUrls} />}

            {/* Engagement Bar */}
            <div className="px-4 py-3 border-t flex items-center gap-6">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`flex items-center gap-2 font-medium ${isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
                >
                    <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500" : ""}`} />
                    <span>{likeCount}</span>
                </motion.button>

                <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <MessageCircle className="h-6 w-6" />
                    <span>{commentsCount}</span>
                </div>
            </div>

            <CommentSection
                postId={id}
                comments={comments}
                showComments={showComments}
                onAddComment={handleAddComment}
                onToggleLike={handleToggleCommentLike}
                toggleComments={toggleComments}
                onAddReply={handleAddReply}
            />
        </motion.div>
    );
}

// Helper: Toggle like on comment or reply
function toggleLike(comments: Comment[], commentId: string): Comment[] {
    return comments.map(c => {
        if (c.id === commentId) {
            return {
                ...c,
                liked: !c.liked,
                likes: c.liked ? c.likes - 1 : c.likes + 1
            };
        }
        if (c.replies) {
            return {
                ...c,
                replies: toggleLike(c.replies, commentId)
            };
        }
        return c;
    });
}