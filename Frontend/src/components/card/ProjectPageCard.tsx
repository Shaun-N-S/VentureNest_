import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  stage: string;
  image: string;
  likes: number;
  liked?: boolean;
  onLike: (updateUI: (liked: boolean, count: number) => void) => void;
  isLikeLoading?: boolean;
  onOpen?: (id: string) => void;
}

export function ProjectPageCard({
  id,
  name,
  description,
  stage,
  image,
  likes,
  liked = false,
  isLikeLoading = false,
  onLike,
}: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(likes);
  }, [liked, likes]);

  const handleClick = () => {
    navigate(`/projects/${id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    onLike((liked, count) => {
      setIsLiked(liked);
      setLikeCount(count);
    });
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-sky-100"
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <Badge
              variant="outline"
              className="mt-1 bg-green-50 text-green-700 border-green-200"
            >
              {stage}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLikeLoading}
            className={`${isLiked ? "text-red-500" : "text-gray-400"}
    ${isLikeLoading ? "opacity-50 cursor-not-allowed" : ""}
  `}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="ml-1 text-sm">{likeCount}</span>
          </Button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Image */}
        <div className="w-full h-48 rounded-xl mb-4 bg-gray-100 flex overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Footer */}
        {/* <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <span className="text-gray-600">Funding Range: </span>
                        <span className="font-semibold text-gray-900">
                            ${minFunding.toLocaleString()} / ${maxFunding.toLocaleString()}
                        </span>
                    </div>

                    <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => onContribute?.(id)}
                    >
                        Contribute
                    </Button>
                </div> */}
      </div>
    </motion.div>
  );
}
