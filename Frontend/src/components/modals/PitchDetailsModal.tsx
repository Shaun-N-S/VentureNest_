import { motion } from "framer-motion";
import { Dialog, DialogContent } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Loader2,
  Send,
  Calendar,
  Building2,
  User,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import {
  useFetchPitchDetails,
  useRespondToPitch,
} from "../../hooks/Pitch/pitchHooks";
import { useNavigate } from "react-router-dom";
import { PitchStatus } from "../../types/pitchType";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";

const statusConfig: Record<
  PitchStatus,
  { color: string; bgColor: string; label: string }
> = {
  SENT: {
    color: "text-amber-700",
    bgColor: "bg-amber-50 border border-amber-200",
    label: "Sent",
  },
  VIEWED: {
    color: "text-blue-700",
    bgColor: "bg-blue-50 border border-blue-200",
    label: "Viewed",
  },
  RESPONDED: {
    color: "text-green-700",
    bgColor: "bg-green-50 border border-green-200",
    label: "Responded",
  },
};

const statusColor: Record<PitchStatus, string> = {
  SENT: "bg-amber-50 border border-amber-200 text-amber-700",
  VIEWED: "bg-blue-50 border border-blue-200 text-blue-700",
  RESPONDED: "bg-green-50 border border-green-200 text-green-700",
};

interface Props {
  open: boolean;
  onClose: () => void;
  pitchId: string;
}

export function PitchDetailsModal({ open, onClose, pitchId }: Props) {
  const navigate = useNavigate();
  const role = useSelector((s: Rootstate) => s.authData.role);

  const { data, isLoading } = useFetchPitchDetails(pitchId);
  const { mutate: respond, isPending } = useRespondToPitch();

  const [reply, setReply] = useState("");

  const isInvestor = role === "INVESTOR";

  const handleReply = () => {
    if (!reply.trim()) return;
    respond({ pitchId, message: reply }, { onSuccess: () => setReply("") });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl xs:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl xs:rounded-2xl p-0 w-full mx-auto">
        {isLoading || !data ? (
          <motion.div
            className="flex justify-center items-center py-16 xs:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header Section - Document Style */}
            <motion.div
              className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 xs:p-6 sm:p-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-3 xs:space-y-4">
                <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-4">
                  <div className="space-y-1 xs:space-y-2 flex-1 min-w-0">
                    <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-balance break-words">
                      {data.subject}
                    </h1>
                    <p className="text-slate-300 xs:text-slate-200 text-xs xs:text-sm flex items-center gap-2">
                      <Calendar className="w-3 xs:w-4 h-3 xs:h-4 flex-shrink-0" />
                      {new Date(data.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    className={`${statusConfig[data.status].color} ${statusConfig[data.status].bgColor} font-medium text-xs xs:text-sm flex-shrink-0`}
                  >
                    {statusConfig[data.status].label}
                  </Badge>
                </div>

                {/* Parties Involved */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 pt-1 xs:pt-2">
                  <motion.div
                    className="flex items-center gap-2 xs:gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Building2 className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Project</p>
                      <p className="text-xs xs:text-sm font-medium text-white truncate">
                        {data.project.name}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2 xs:gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <User className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Founder</p>
                      <p className="text-xs xs:text-sm font-medium text-white truncate">
                        {data.founder.name}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 p-4 xs:p-6 sm:p-8 space-y-5 xs:space-y-6">
              {/* Pitch Message Section */}
              <motion.div
                className="space-y-2 xs:space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xs xs:text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <MessageCircle className="w-3 xs:w-4 h-3 xs:h-4 text-slate-600 flex-shrink-0" />
                  Pitch Message
                </h2>
                <div className="p-3 xs:p-4 sm:p-5 rounded-lg xs:rounded-xl border border-slate-200 bg-slate-50 whitespace-pre-wrap text-xs xs:text-sm leading-relaxed text-slate-700">
                  {data.message}
                </div>
              </motion.div>

              {/* Investor Reply Section */}
              {data.investorReply && (
                <motion.div
                  className="space-y-2 xs:space-y-3 pt-3 xs:pt-4 border-t border-slate-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xs xs:text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <MessageCircle className="w-3 xs:w-4 h-3 xs:h-4 text-green-600 flex-shrink-0" />
                    Investor Response
                  </h2>
                  <div className="p-3 xs:p-4 sm:p-5 rounded-lg xs:rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 whitespace-pre-wrap text-xs xs:text-sm leading-relaxed text-green-900">
                    {data.investorReply.message}
                  </div>
                </motion.div>
              )}

              {/* Investor Actions */}
              {isInvestor && (
                <motion.div
                  className="space-y-3 xs:space-y-4 pt-3 xs:pt-4 border-t border-slate-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {!data.investorReply && (
                    <div className="space-y-2 xs:space-y-3">
                      <label className="text-xs xs:text-sm font-semibold text-slate-900">
                        Send a Reply
                      </label>
                      <Textarea
                        placeholder="Share your thoughts on this pitch..."
                        rows={3}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="resize-none rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs xs:text-sm"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleReply}
                          disabled={!reply.trim() || isPending}
                          className="gap-2 bg-blue-600 hover:bg-blue-700 text-xs xs:text-sm h-9 xs:h-10"
                        >
                          {isPending && (
                            <Loader2 className="w-3 xs:w-4 h-3 xs:h-4 animate-spin" />
                          )}
                          <Send className="w-3 xs:w-4 h-3 xs:h-4" />
                          <span className="hidden xs:inline">Send Reply</span>
                          <span className="xs:hidden">Send</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() =>
                      navigate(
                        `/investor/send-offer/${data.project.id}/${data.pitchId}`,
                      )
                    }
                    className="w-full h-9 xs:h-10 sm:h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-medium text-white text-xs xs:text-sm"
                  >
                    Send Investment Offer
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
