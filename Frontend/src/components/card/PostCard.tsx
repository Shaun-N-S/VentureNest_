import { Heart, MessageCircle, MoreVertical } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import type { PostCardProps } from "../../types/PostCardPropsType"
import { MediaCarousel } from "../Carousel/MediaCarousel"
import { useEffect, useRef, useState } from "react"
import { CommentSection, type Comment } from "../Comments/CommentSection"

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

    // Mock comments with replies
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 'c1',
            user: { name: 'Alice', avatar: '/avatar-alice.jpg' },
            text: 'This is amazing! Keep it up!',
            liked: true,
            likes: 8,
            replies: [
                {
                    id: 'r1',
                    user: { name: 'Bob', avatar: '/avatar-bob.jpg' },
                    text: 'Totally agree!',
                    liked: false,
                    likes: 3,
                }
            ]
        },
        {
            id: 'c2',
            user: { name: 'Sarah', avatar: '/avatar-sarah.jpg' },
            text: 'When is the launch?',
            liked: false,
            likes: 5,
        },
    ]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleLike = () => {
        if (isLiked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setIsLiked(!isLiked);
        onLike?.();
        console.log("Post liked/unliked:", id, "New count:", likeCount + (isLiked ? -1 : 1));
    };

    // Add new comment or reply
    const handleAddComment = (postId: string, text: string, parentId?: string) => {
        const newComment: Comment = {
            id: Date.now().toString(),
            user: { name: "You", avatar: "/your-avatar.jpg" },
            text,
            liked: false,
            likes: 0,
            replies: parentId ? undefined : [],
        };

        if (parentId) {
            setComments(prev => addReply(prev, parentId, newComment));
            console.log("Reply added to comment:", parentId, newComment);
        } else {
            setComments(prev => [...prev, newComment]);
            console.log("New comment added:", newComment);
        }

        setCommentsCount(prev => prev + 1);
    };

    // Toggle like on comment/reply
    const handleToggleCommentLike = (commentId: string) => {
        setComments(prev => toggleLike(prev, commentId));
        console.log("Comment like toggled:", commentId);
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
                                        console.log("Reported post:", id);
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

            {/* Comment Section – Fully Working with Mock */}
            <CommentSection
                postId={id}
                comments={comments}
                onAddComment={handleAddComment}
                onToggleLike={handleToggleCommentLike}
            />
        </motion.div>
    );
}

// Helper: Add reply to nested structure
function addReply(comments: Comment[], parentId: string, reply: Comment): Comment[] {
    return comments.map(c => {
        if (c.id === parentId) {
            return {
                ...c,
                replies: [...(c.replies || []), reply]
            };
        }
        if (c.replies) {
            return {
                ...c,
                replies: addReply(c.replies, parentId, reply)
            };
        }
        return c;
    });
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