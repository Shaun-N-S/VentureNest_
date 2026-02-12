import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import type { NetworkProfileCardProps } from "../../types/networkProfileCardProps";
import type { ConnectionStatus } from "../../types/connectionStatus";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import { UserPlus, Clock, CheckCircle2, RotateCcw } from "lucide-react";

export const NetworkProfileCard = ({
  id,
  profileImg,
  name,
  desc,
  role,
  sendConnection,
  connectionStatus,
}: NetworkProfileCardProps) => {
  const [status, setStatus] = useState<ConnectionStatus>(connectionStatus);
  const firstLetter = name.charAt(0).toUpperCase();

  const navigate = useNavigate();
  const loggedInUserId = useSelector((state: Rootstate) => state.authData.id);

  const canConnect = status === "none" || status === "rejected";

  const handleProfileClick = () => {
    const isSelf = id === loggedInUserId;
    if (role === "INVESTOR") {
      navigate(isSelf ? "/investor/profile" : `/investor/profile/${id}`);
    } else {
      navigate(isSelf ? "/profile" : `/profile/${id}`);
    }
  };

  const handleClick = async () => {
    if (!canConnect) return;
    const ok = await sendConnection(id);
    if (ok) setStatus("pending");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden rounded-xl border-slate-200 bg-white transition-all duration-300 hover:shadow-lg group h-full flex flex-col">
        {/* Compact Header Gradient */}
        <div className="h-14 w-full bg-gradient-to-r from-blue-600 to-indigo-500" />

        <CardContent className="relative flex flex-col items-center px-3 pb-4 pt-0 flex-1">
          {/* Smaller, More Refined Avatar */}
          <div className="relative -mt-8 mb-2">
            <Avatar
              className="h-16 w-16 md:h-20 md:w-20 cursor-pointer border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-105"
              onClick={handleProfileClick}
            >
              <AvatarImage
                src={profileImg || undefined}
                className="object-cover"
              />
              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-lg">
                {firstLetter}
              </AvatarFallback>
            </Avatar>

            {/* Status Indicator */}
            <div className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
          </div>

          {/* User Info - Compact Version */}
          <div className="text-center flex-1 w-full space-y-1">
            <h2
              className="text-sm md:text-base font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors line-clamp-1 leading-tight"
              onClick={handleProfileClick}
            >
              {name}
            </h2>

            <div className="inline-flex px-1.5 py-0.5 rounded bg-blue-50">
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                {role}
              </span>
            </div>

            <p className="text-[11px] md:text-xs text-slate-500 leading-snug line-clamp-2 min-h-[32px] px-1">
              {desc || "Collaborating on the next big venture."}
            </p>
          </div>

          {/* Optimized Button Section */}
          <div className="w-full pt-3">
            <Button
              disabled={!canConnect}
              onClick={handleClick}
              size="sm"
              className={`w-full h-8 rounded-md text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                status === "none"
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : status === "pending"
                    ? "bg-slate-100 text-slate-400 border border-slate-200"
                    : status === "accepted"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}
            >
              {status === "none" && <UserPlus size={14} />}
              {status === "pending" && <Clock size={14} />}
              {status === "accepted" && <CheckCircle2 size={14} />}
              {status === "rejected" && <RotateCcw size={14} />}

              <span className="truncate">
                {status === "none"
                  ? "Connect"
                  : status === "pending"
                    ? "Pending"
                    : status === "accepted"
                      ? "Connected"
                      : "Re-connect"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
