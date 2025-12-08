import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Send, Heart, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import { useGetAllReplies } from "../../hooks/Reply/replyHooks";
import type { ReplyApiResponse } from "../../types/replyFeedType";

export interface Comment {
    id: string;
    user: {
        name: string;
        avatar?: string;
    };
    text: string;
    liked: boolean;
    likes: number;
    repliesCount?: number;
    replies?: Comment[];
}

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    showComments: boolean;
    toggleComments?: () => void;
    onAddComment?: (postId: string, text: string, parentId?: string) => void;
    onAddReply?: (commentId: string, replyText: string) => void;
    onToggleLike?: (commentId: string) => void;
}

export function CommentSection({
    postId,
    comments,
    showComments,
    onAddComment,
    onAddReply,
    onToggleLike,
    toggleComments,
}: CommentSectionProps) {
    const [input, setInput] = useState("");
    const userProfileImg = useSelector((state: Rootstate) => state.authData?.profileImg);

    const handleSubmit = () => {
        if (!input.trim()) return;
        onAddComment?.(postId, input);
        setInput("");
    };

    return (
        <div className="px-4 py-3 border-t border-gray-200">
            {/* Toggle Comments */}
            <button
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={toggleComments}
            >
                <MessageCircle className="h-4 w-4" />
                {showComments ? "Hide Comments" : "View Comments"}
            </button>

            {/* Comment Input */}
            <div className="mt-3 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfileImg} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
                    <input
                        className="w-full bg-transparent outline-none text-sm"
                        placeholder="Add a comment..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSubmit}
                        disabled={!input.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Comment List */}
            {showComments && (
                <div className="mt-4 space-y-4">
                    {comments.map((c) => (
                        <SingleComment
                            key={c.id}
                            comment={c}
                            onToggleLike={onToggleLike}
                            onAddReply={onAddReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ---------------------------------------------
   SINGLE COMMENT COMPONENT WITH REPLIES
---------------------------------------------- */
function SingleComment({
    comment,
    onToggleLike,
    onAddReply,
}: {
    comment: Comment;
    onToggleLike?: (commentId: string) => void;
    onAddReply?: (commentId: string, replyText: string) => void;
}) {
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const limit = 10;

    // Fetch replies only when showReplies is true
    const { data: replyData, isLoading, refetch } = useGetAllReplies(
        comment.id,
        page,
        limit,
        { enabled: false }
    );

    /** Load replies when showReplies toggles ON */
    useEffect(() => {
        if (showReplies) {
            refetch();
        }
    }, [showReplies]);

    /** Map backend replies into UI format */
    useEffect(() => {
        if (replyData?.replies) {
            const formatted = replyData.replies.map((reply: ReplyApiResponse) => ({
                id: reply._id,
                user: {
                    name: reply.replierName,
                    avatar: reply.replierProfileImg,
                },
                text: reply.replyText,
                liked: false,
                likes: reply.likes || 0,
                replies: [],
            }));
            setReplies(formatted);
        }
    }, [replyData]);


    const handleSubmitReply = () => {
        if (!replyText.trim()) return;

        // Optimistic UI
        const tempReply: Comment = {
            id: `temp-${Date.now()}`,
            user: { name: "You", avatar: "" },
            text: replyText,
            liked: false,
            likes: 0,
            replies: [],
        };

        setReplies(prev => [...prev, tempReply]);

        // Call backend
        onAddReply?.(comment.id, replyText);

        setReplyText("");
        setReplying(false);
    };

    const totalReplies = comment.repliesCount || replyData?.total || replies.length;

    return (
        <div className="flex gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
                {/* Comment Text */}
                <div>
                    <span className="font-semibold text-sm">{comment.user.name}</span>{" "}
                    <span className="text-sm text-gray-700">{comment.text}</span>
                </div>

                {/* Like + Reply */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <button
                        onClick={() => onToggleLike?.(comment.id)}
                        className={`flex items-center gap-1 ${comment.liked ? "text-red-500" : ""}`}
                    >
                        <Heart className={`h-4 w-4 ${comment.liked ? "fill-red-500" : ""}`} />
                        {comment.likes}
                    </button>

                    <button className="hover:underline" onClick={() => setReplying(!replying)}>
                        Reply
                    </button>
                </div>

                {/* Reply Input */}
                {replying && (
                    <div className="mt-2 flex items-center gap-2">
                        <input
                            className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-sm outline-none"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmitReply();
                                }
                            }}
                        />
                        <Button size="sm" onClick={handleSubmitReply} disabled={!replyText.trim()}>
                            Comment
                        </Button>
                    </div>
                )}

                {/* Replies Toggle */}
                {totalReplies > 0 && (
                    <div className="mt-2">
                        <button
                            className="text-xs text-gray-600 hover:text-gray-900"
                            onClick={() => setShowReplies(prev => !prev)}
                        >
                            {showReplies ? "Hide replies" : `View replies (${totalReplies})`}
                        </button>

                        {/* Replies List */}
                        {showReplies && (
                            <div className="mt-2 ml-6 space-y-3">
                                {isLoading ? (
                                    <div className="text-xs text-gray-500">Loading replies...</div>
                                ) : (
                                    replies.map((reply) => (
                                        <SingleReply
                                            key={reply.id}
                                            reply={reply}
                                            onToggleLike={onToggleLike}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


/* ---------------------------------------------
   SINGLE REPLY COMPONENT (Nested)
---------------------------------------------- */
function SingleReply({
    reply,
    onToggleLike,
}: {
    reply: Comment;
    onToggleLike?: (commentId: string) => void;
}) {
    return (
        <div className="flex gap-3">
            <Avatar className="h-7 w-7">
                <AvatarImage src={reply.user.avatar} />
                <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div>
                    <span className="font-semibold text-sm">{reply.user.name}</span>{" "}
                    <span className="text-sm text-gray-700">{reply.text}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <button
                        onClick={() => onToggleLike?.(reply.id)}
                        className={`flex items-center gap-1 ${reply.liked ? "text-red-500" : ""
                            }`}
                    >
                        <Heart
                            className={`h-3 w-3 ${reply.liked ? "fill-red-500 text-red-500" : ""
                                }`}
                        />
                        {reply.likes}
                    </button>
                </div>
            </div>
        </div>
    );
}