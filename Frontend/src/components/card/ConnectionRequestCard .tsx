import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";

interface MinimalUser {
  id: string;
  userName: string;
  profileImg?: string;
  role?: string;
  bio?: string;
}

interface ConnectionRequestCardProps {
  user: MinimalUser;
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
}

export const ConnectionRequestCard = ({
  user,
  onAccept,
  onReject,
}: ConnectionRequestCardProps) => {
  const firstLetter = user.userName?.[0]?.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-gray-50 transition w-full">
        {/* Avatar Section */}
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.profileImg || undefined} />
          <AvatarFallback className="bg-gray-200 text-lg font-semibold">
            {firstLetter}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <CardContent className="flex flex-col flex-1 text-center sm:text-left p-0">
          <h3 className="font-semibold text-lg">{user.userName}</h3>
          <p className="text-sm text-gray-600">{user.role}</p>
          <p className="text-sm text-gray-500 line-clamp-2 max-w-[200px] sm:max-w-none">
            {user.bio}
          </p>
        </CardContent>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full sm:w-auto justify-center">
          <Button
            size="icon"
            className="rounded-full bg-green-600 hover:bg-green-700 w-10 h-10"
            onClick={() => onAccept(user.id)}
          >
            <Check className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            className="rounded-full w-10 h-10"
            onClick={() => onReject(user.id)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
