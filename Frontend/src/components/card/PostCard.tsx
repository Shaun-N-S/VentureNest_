import { Heart, MessageCircle, MoreVertical } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import type { PostCardProps } from "../../types/PostCardPropsType"

export function PostCard({
    id,
    author,
    timestamp,
    content,
    link,
    image,
    likes = 0,
    comments = 0,
    liked = false,
    onLike,
}: PostCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
            {/* Header */}
            <div className="p-3 sm:p-4 md:p-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 flex-shrink-0">
                        <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{author.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                            {author.followers.toLocaleString()} followers • {timestamp}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
            </div>

            {/* Content */}
            <div className="px-3 sm:px-4 md:px-5 pb-2 sm:pb-3 md:pb-4">
                <p className="text-sm sm:text-base text-gray-900 mb-2 break-words">{content}</p>
                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-xs sm:text-sm hover:underline break-all"
                    >
                        {link}
                    </a>
                )}
            </div>

            {/* Image */}
            {image && (
                <div className="relative w-full aspect-video bg-gray-100">
                    {/* <Image src={image || "/placeholder.svg"} alt="Post content" fill className="object-cover" /> */}
                    <img
                        src={image || "/placeholder.svg"}
                        alt="Post content"
                        className="object-cover w-full h-full"
                        loading="lazy" // enables lazy loading
                    />
                </div>
            )}

            {/* Engagement */}
            <div className="px-3 sm:px-4 md:px-5 py-3 md:py-4 border-t border-gray-200 flex items-center gap-4 sm:gap-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLike}
                    className={`flex items-center gap-2 transition-colors ${liked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
                >
                    <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${liked ? "fill-current" : ""}`} />
                    <span className="text-xs sm:text-sm font-medium">{likes}</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-xs sm:text-sm font-medium">{comments}</span>
                </motion.button>
            </div>
        </motion.div>
    )
}
