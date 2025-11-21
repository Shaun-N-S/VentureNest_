import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Send, Heart, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

export interface Comment {
    id: string;
    user: {
        name: string;
        avatar?: string;
    };
    text: string;
    liked: boolean;
    likes: number;
    replies?: Comment[];
}

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    onAddComment?: (postId: string, text: string, parentId?: string) => void;
    onToggleLike?: (commentId: string) => void;
}

export function CommentSection({
    postId,
    comments,
    onAddComment,
    onToggleLike,
}: CommentSectionProps) {
    const [showComments, setShowComments] = useState(false);
    const [input, setInput] = useState("");

    const handleSubmit = () => {
        if (!input.trim()) return;
        onAddComment?.(postId, input);
        setInput("");
    };

    return (
        <div className="px-4 py-3 border-t border-gray-200">

            {/* ◼️ Toggle Comments */}
            <button
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                onClick={() => setShowComments(!showComments)}
            >
                <MessageCircle className="h-4 w-4" />
                {showComments ? "Hide Comments" : "View Comments"}
                {showComments ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </button>

            {/* ◼️ Comment Input */}
            <div className="mt-3 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
                    <input
                        className="w-full bg-transparent outline-none text-sm"
                        placeholder="Add a comment..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
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

            {/* ◼️ Comment List */}
            {showComments && (
                <div className="mt-4 space-y-4">
                    {comments.map((c) => (
                        <SingleComment
                            key={c.id}
                            comment={c}
                            onToggleLike={onToggleLike}
                            postId={postId}
                            onAddComment={onAddComment}
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
    postId,
    onAddComment,
}: {
    comment: Comment;
    postId: string;
    onToggleLike?: (commentId: string) => void;
    onAddComment?: (postId: string, text: string, parentId?: string) => void;
}) {
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(false);

    return (
        <div className="flex gap-3">
            {/* Avatar */}
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
                        className={`flex items-center gap-1 ${comment.liked ? "text-red-500" : ""
                            }`}
                    >
                        <Heart
                            className={`h-4 w-4 ${comment.liked ? "fill-red-500 text-red-500" : ""
                                }`}
                        />
                        {comment.likes}
                    </button>

                    <button
                        className="hover:underline"
                        onClick={() => setReplying(!replying)}
                    >
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
                        />
                        <Button
                            size="sm"
                            onClick={() => {
                                onAddComment?.(postId, replyText, comment.id);
                                setReplyText("");
                                setReplying(false);
                            }}
                            disabled={!replyText.trim()}
                        >
                            Send
                        </Button>
                    </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2">
                        <button
                            className="text-xs text-gray-600 hover:text-gray-900"
                            onClick={() => setShowReplies(!showReplies)}
                        >
                            {showReplies
                                ? "Hide replies"
                                : `View replies (${comment.replies.length})`}
                        </button>

                        {showReplies && (
                            <div className="mt-2 ml-6 space-y-3">
                                {comment.replies.map((reply) => (
                                    <SingleComment
                                        key={reply.id}
                                        comment={reply}
                                        postId={postId}
                                        onToggleLike={onToggleLike}
                                        onAddComment={onAddComment}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
