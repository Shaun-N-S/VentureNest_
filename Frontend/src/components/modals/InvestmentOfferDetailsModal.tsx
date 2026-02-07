import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  Percent,
  DollarSign,
  FileText,
  AlertCircle,
  Building2,
  User,
} from "lucide-react";

import {
  useFetchInvestmentOfferDetails,
  useAcceptInvestmentOffer,
  useRejectInvestmentOffer,
} from "../../hooks/Investor/InvestmentOffer/InvestmentOfferHooks";

import { OfferStatus } from "../../types/investmentOfferType";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";

import RejectReasonModal from "../modals/RejectReasonModal";

/* ---------------- Status Config ---------------- */

const statusConfig: Record<
  OfferStatus,
  { color: string; bgColor: string; label: string }
> = {
  PENDING: {
    color: "text-amber-700",
    bgColor: "bg-amber-50 border border-amber-200",
    label: "Pending",
  },
  ACCEPTED: {
    color: "text-green-700",
    bgColor: "bg-green-50 border border-green-200",
    label: "Accepted",
  },
  REJECTED: {
    color: "text-red-700",
    bgColor: "bg-red-50 border border-red-200",
    label: "Rejected",
  },
  EXPIRED: {
    color: "text-slate-700",
    bgColor: "bg-slate-50 border border-slate-200",
    label: "Expired",
  },
};

interface Props {
  open: boolean;
  offerId: string;
  onClose: () => void;
}

export function InvestmentOfferDetailsModal({ open, offerId, onClose }: Props) {
  const { data, isLoading, isError } = useFetchInvestmentOfferDetails(offerId);

  const { mutate: acceptOffer, isPending: accepting } =
    useAcceptInvestmentOffer();

  const { mutate: rejectOffer, isPending: rejecting } =
    useRejectInvestmentOffer();

  const [showRejectModal, setShowRejectModal] = useState(false);

  const userRole = useSelector((state: Rootstate) => state.authData.role);
  const isFounder = userRole === "USER";

  const handleAccept = () => {
    acceptOffer(offerId, {
      onSuccess: () => onClose(),
    });
  };

  const handleReject = (reason: string) => {
    rejectOffer(
      { offerId, reason },
      {
        onSuccess: () => {
          setShowRejectModal(false);
          onClose();
        },
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] md:w-full sm:max-w-3xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden rounded-xl">
          {isLoading ? (
            <Loader />
          ) : isError || !data ? (
            <ErrorState />
          ) : !data.project || !data.founder || !data.investor ? (
            <IncompleteState />
          ) : (
            <motion.div
              className="flex flex-col h-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Section */}
              <div className="flex-shrink-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 sm:p-6 border-b z-10">
                <div className="space-y-4">
                  {/* Title and Status */}
                  <div className="flex flex-row items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h1 className="text-lg sm:text-2xl font-bold truncate">
                        Investment Offer
                      </h1>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(data.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </p>
                    </div>
                    <Badge
                      className={`${statusConfig[data.status].color} ${
                        statusConfig[data.status].bgColor
                      } font-medium flex-shrink-0 text-xs sm:text-sm px-2 py-0.5`}
                    >
                      {statusConfig[data.status].label}
                    </Badge>
                  </div>

                  {/* Parties Grid - Stacks on mobile, 3 columns on tablet+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t">
                    <div className="flex items-center gap-2.5 p-1 rounded-md hover:bg-black/5 transition-colors">
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-background shadow-sm">
                        <AvatarImage
                          src={data.project.logoUrl}
                          alt={data.project.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
                          {data.project.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Project
                        </p>
                        <p className="text-sm font-semibold truncate">
                          {data.project.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-1 rounded-md hover:bg-black/5 transition-colors">
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-background shadow-sm">
                        <AvatarImage
                          src={data.founder.profileImg}
                          alt={data.founder.name}
                        />
                        <AvatarFallback className="bg-purple-500/10 text-purple-700 font-semibold text-xs sm:text-sm">
                          {data.founder.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Founder
                        </p>
                        <p className="text-sm font-semibold truncate">
                          {data.founder.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-1 rounded-md hover:bg-black/5 transition-colors">
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-background shadow-sm">
                        <AvatarImage src={data.investor.profileImg} />
                        <AvatarFallback className="bg-green-500/10 text-green-700 font-semibold text-xs sm:text-sm">
                          {/* {data.investor.name?.charAt(0).toUpperCase() ?? "I"} */}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Investor
                        </p>
                        <p className="text-sm font-semibold truncate">
                          {data.investor.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Financial Details */}
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Financial Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FinancialCard
                      icon={<DollarSign className="w-5 h-5" />}
                      label="Investment"
                      value={`$${(data.amount / 1000000).toFixed(1)}M`}
                      subtext={`$${data.amount.toLocaleString()}`}
                      color="emerald"
                    />
                    <FinancialCard
                      icon={<Percent className="w-5 h-5" />}
                      label="Equity"
                      value={`${data.equityPercentage}%`}
                      subtext="of company"
                      color="blue"
                    />
                    {data.valuation && (
                      <FinancialCard
                        icon={<TrendingUp className="w-5 h-5" />}
                        label="Valuation"
                        value={`$${(data.valuation / 1000000).toFixed(0)}M`}
                        subtext={`$${data.valuation.toLocaleString()}`}
                        color="purple"
                      />
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Terms & Conditions
                  </h2>
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">
                      {data.terms}
                    </p>
                  </Card>
                </div>

                {/* Note */}
                {data.note && (
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold">Additional Note</h2>
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <p className="text-sm text-blue-900 whitespace-pre-wrap break-words leading-relaxed">
                        {data.note}
                      </p>
                    </Card>
                  </div>
                )}

                {/* Rejection Reason */}
                {data.status === OfferStatus.REJECTED &&
                  data.rejectionReason && (
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        Rejection Reason
                      </h2>
                      <Card className="p-4 bg-red-50 border-red-200">
                        <p className="text-sm text-red-900 whitespace-pre-wrap break-words leading-relaxed">
                          {data.rejectionReason}
                        </p>
                      </Card>
                    </div>
                  )}

                {/* Expiry Info */}
                {data.expiresAt && (
                  <Card className="p-3 bg-amber-50 border-amber-200">
                    <p className="text-sm text-amber-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        <span className="font-semibold">Expires:</span>{" "}
                        {new Date(data.expiresAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  </Card>
                )}
              </div>

              {/* Footer Actions - Sticky Bottom */}
              {isFounder && data.status === OfferStatus.PENDING && (
                <div className="flex-shrink-0 border-t bg-muted/30 p-4 sm:p-6 mt-auto">
                  <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectModal(true)}
                      disabled={accepting || rejecting}
                      className="w-full sm:w-auto gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Offer
                    </Button>

                    <Button
                      onClick={handleAccept}
                      disabled={accepting || rejecting}
                      className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2"
                    >
                      {accepting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Accept Offer
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Reason Modal */}
      <RejectReasonModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleReject}
        title="Reject Investment Offer"
        label="Reason for rejecting this offer"
      />
    </>
  );
}

/* ================= Helper Components ================= */

function FinancialCard({
  icon,
  label,
  value,
  subtext,
  color = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color?: "emerald" | "blue" | "purple" | "primary";
}) {
  const colorClasses = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    primary: "from-primary to-primary/80",
  };

  return (
    <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{label}</p>
          <div
            className={`p-1.5 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white`}
          >
            {icon}
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-bold truncate">{value}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
            {subtext}
          </p>
        </div>
      </div>
    </Card>
  );
}

function Loader() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="space-y-3 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">
          Loading offer details...
        </p>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="py-16 px-4 text-center">
      <Card className="inline-flex items-center gap-3 p-4 bg-red-50 border-red-200">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span className="text-sm font-medium text-red-900">
          Failed to load investment offer
        </span>
      </Card>
    </div>
  );
}

function IncompleteState() {
  return (
    <div className="py-16 px-4 text-center">
      <Card className="inline-flex items-center gap-3 p-4 bg-amber-50 border-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <span className="text-sm font-medium text-amber-900">
          Incomplete investment offer data
        </span>
      </Card>
    </div>
  );
}
