import { Heart, MoreVertical } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import type { ProjectCardProps } from "../../types/ProjectCardPropsType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProjectCard({
  id,
  title,
  description,
  stage,
  logoUrl,
  likes = 0,
  liked = false,
  registrationStatus,
  rejectionReason,
  isOwnProfile = false,
  onLike,
  onEdit,
  onAddReport,
  onVerify,
  onRemove,
}: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(liked);
  console.log(liked);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(liked);
  }, [liked]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);

    onLike?.((newLiked) => {
      setIsLiked(newLiked);
    });
  };

  const STATUS_CONFIG = {
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    SUBMITTED: "bg-yellow-100 text-yellow-700",
    PENDING: "bg-blue-100 text-blue-700",
  };

  const statusClass = registrationStatus && STATUS_CONFIG[registrationStatus];

  const canSeeFullStatus = isOwnProfile;

  const canShowStatusBadge =
    registrationStatus &&
    (canSeeFullStatus || registrationStatus === "APPROVED");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/projects/${id}`)}
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
            {canShowStatusBadge && (
              <Badge className={`text-[10px] sm:text-xs ${statusClass}`}>
                {registrationStatus.charAt(0) +
                  registrationStatus.slice(1).toLowerCase()}
              </Badge>
            )}
          </div>

          {canSeeFullStatus &&
            registrationStatus === "REJECTED" &&
            rejectionReason && (
              <p className="text-xs text-red-600 mt-2">
                Rejected: {rejectionReason}
              </p>
            )}

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
            onClick={handleLike}
            className={isLiked ? "text-red-500" : "text-gray-600"}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isLiked ? "fill-red-500" : ""
              }`}
            />
          </Button>

          <span className="text-sm font-semibold">{likes}</span>
        </div>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="px-3 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Edit Project
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onAddReport?.(id);
              }}
              className="px-3 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Add Monthly Report
            </DropdownMenuItem>

            {registrationStatus !== "APPROVED" && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onVerify?.(id);
                }}
                className="px-3 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Verify Project
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(id);
              }}
              className="px-3 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Remove Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
