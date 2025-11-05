"use client"

import { Heart, MoreVertical } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { motion } from "framer-motion"
import type { ProjectCardProps } from "../../types/ProjectCardPropsType"


export function ProjectCard({
    id,
    title,
    description,
    stage,
    logo,
    likes = 0,
    liked = false,
    onLike,
}: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-gray-100 rounded-2xl p-4 md:p-6 flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
        >
            {/* Left Section - Logo & Info */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <Avatar className="h-14 w-14 md:h-16 md:w-16 flex-shrink-0 bg-green-500">
                    <AvatarImage src={logo || "/placeholder.svg"} alt={title} />
                    <AvatarFallback className="bg-green-500 text-white font-bold">{title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-base md:text-lg text-gray-900 truncate">{title}</h3>
                        <Badge variant="outline" className="text-xs bg-white border-gray-300">
                            {stage}
                        </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{description}</p>
                </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLike}
                    className={`h-8 w-8 md:h-10 md:w-10 ${liked ? "text-red-500" : "text-gray-600"}`}
                >
                    <Heart className={`h-5 w-5 md:h-6 md:w-6 ${liked ? "fill-current" : ""}`} />
                </Button>
                <span className="text-xs md:text-sm font-semibold text-gray-700 min-w-[2rem]">{likes}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    )
}
