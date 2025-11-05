import { MessageCircle, Share2, MoreVertical } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { motion } from "framer-motion"
import type { ProfileCardProps } from "../../types/ProfileCardPropsType"



export function ProfileCard({
    name,
    title,
    bio,
    avatar,
    verified = false,
    stats,
    onFollow,
    isFollowing = false,
}: ProfileCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto bg-card rounded-2xl border border-border p-6 md:p-8"
        >
            {/* Header with menu */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    {/* Avatar and Name */}
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20">
                            <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold">{name}</h2>
                                {verified && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                        ✓ Verified
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{title}</p>
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm md:text-base text-foreground mb-4">{bio}</p>

                    {/* Stats */}
                    <div className="flex gap-6 md:gap-8">
                        <div className="text-center">
                            <p className="font-bold text-lg md:text-xl">{stats.posts}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">Posts</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg md:text-xl">{stats.followers.toLocaleString()}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg md:text-xl">{stats.following}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">Following</p>
                        </div>
                    </div>
                </div>

                {/* Menu button */}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
                <Button onClick={onFollow} variant={isFollowing ? "outline" : "default"} className="flex-1">
                    {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                    <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    )
}
