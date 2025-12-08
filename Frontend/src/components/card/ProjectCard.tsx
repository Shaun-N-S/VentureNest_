import { Heart, MoreVertical } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { motion } from "framer-motion"
import type { ProjectCardProps } from "../../types/ProjectCardPropsType"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export function ProjectCard({
    id,
    title,
    description,
    stage,
    logoUrl,
    likes = 0,
    liked = false,
    onLike,
    onEdit,
    onAddReport,
    onVerify,
}: ProjectCardProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="
                w-full bg-gray-100 rounded-2xl p-3 sm:p-4 md:p-6 
                flex flex-col sm:flex-row 
                sm:items-center items-start 
                justify-between gap-4 sm:gap-5 
                hover:shadow-md transition-shadow
            "
        >
            {/* LEFT SECTION */}
            <div className="flex items-start sm:items-center gap-3 md:gap-4 flex-1 min-w-0 w-full">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex-shrink-0 bg-green-500">
                    <AvatarImage src={logoUrl || "/placeholder.svg"} alt={title} />
                    <AvatarFallback className="bg-green-500 text-white font-bold">
                        {title.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 truncate max-w-[180px] sm:max-w-full">
                            {title}
                        </h3>

                        <Badge
                            variant="outline"
                            className="text-[10px] sm:text-xs bg-white border-gray-300"
                        >
                            {stage}
                        </Badge>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                {/* Like Button */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onLike}
                        className={`
                            h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 
                            ${liked ? "text-red-500" : "text-gray-600"}
                        `}
                    >
                        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${liked ? "fill-current" : ""}`} />
                    </Button>

                    <span className="text-xs sm:text-sm font-semibold text-gray-700 min-w-[1.5rem] sm:min-w-[2rem]">
                        {likes}
                    </span>
                </div>

                {/* More Options */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                                h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 
                                text-gray-600 
                                hover:bg-gray-200 rounded-full
                            "
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="
                            w-48 sm:w-52 rounded-xl bg-white/80 backdrop-blur-md shadow-xl 
                            border border-gray-200 p-2
                        "
                    >
                        <DropdownMenuItem
                            onClick={() => onEdit?.()}
                            className="px-3 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                            Edit Project
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => onAddReport?.(id)}
                            className="px-3 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                            Add Monthly Report
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => onVerify?.(id)}
                            className="px-3 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                            Verify Project
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.div>
    )
}
