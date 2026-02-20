import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
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
  CreditCard,
  History,
  ChevronRight,
  Info,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";

import {
  useFetchInvestmentOfferDetails,
  useAcceptInvestmentOffer,
  useRejectInvestmentOffer,
} from "../../hooks/Investor/InvestmentOffer/InvestmentOfferHooks";
import {
  useCreateDealInstallmentCheckout,
  useReleaseDealInstallment,
} from "../../hooks/Deal/dealHooks";

import { OfferStatus } from "../../types/investmentOfferType";
import type { Rootstate } from "../../store/store";

import RejectReasonModal from "../modals/RejectReasonModal";
import TransferPaymentModal from "./TransferPaymentModal";

/* ---------------- Status Config ---------------- */

const statusConfig: Record<
  OfferStatus,
  { color: string; bgColor: string; label: string; icon: LucideIcon }
> = {
  PENDING: {
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    label: "Pending Review",
    icon: Info,
  },
  ACCEPTED: {
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
    label: "Accepted",
    icon: CheckCircle,
  },
  REJECTED: {
    color: "text-red-700",
    bgColor: "bg-red-100",
    label: "Rejected",
    icon: XCircle,
  },
  EXPIRED: {
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    label: "Expired",
    icon: AlertCircle,
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
  const { mutate: stripeCheckout } = useCreateDealInstallmentCheckout();
  const { mutate: walletRelease } = useReleaseDealInstallment();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const userRole = useSelector((state: Rootstate) => state.authData.role);
  const isInvestor = userRole === "INVESTOR";
  const isFounder = userRole === "USER";

  const handleWalletPayment = (amount: number) => {
    if (!data?.deal) return;
    walletRelease({ dealId: data.deal.dealId, amount });
    setShowTransferModal(false);
  };

  const handleStripePayment = (amount: number) => {
    if (!data?.deal) return;
    stripeCheckout({ dealId: data.deal.dealId, amount });
    setShowTransferModal(false);
  };

  const handleAccept = () => {
    acceptOffer(offerId, { onSuccess: () => onClose() });
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

  if (isLoading)
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <Loader />
        </DialogContent>
      </Dialog>
    );

  const StatusIcon = data?.status ? statusConfig[data.status].icon : Info;
  const progressPercentage = data?.deal
    ? (data.deal.amountPaid / data.deal.totalAmount) * 100
    : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="flex flex-col h-[90vh] md:h-auto max-h-[90vh] bg-background">
            {/* --- Header Section --- */}
            <header className="relative px-6 py-8 bg-slate-900 text-white overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldCheck size={120} />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={`${statusConfig[data!.status].bgColor} ${statusConfig[data!.status].color} border-none`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[data!.status].label}
                    </Badge>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Issued {new Date(data!.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Investment Agreement
                  </h2>
                </div>

                <div className="flex -space-x-3 items-center">
                  {[data!.investor, data!.founder].map((person, i) => (
                    <Avatar
                      key={i}
                      className="h-12 w-12 border-4 border-slate-900"
                    >
                      <AvatarImage src={person.profileImg} />
                      <AvatarFallback className="bg-slate-700 text-white">
                        {person.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="pl-5">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Project
                    </p>
                    <p className="text-sm font-medium text-white">
                      {data!.project.name}
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* --- Main Content --- */}
            <main className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Financial Dashboard */}
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Capital Structure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    label="Total Investment"
                    value={`$${data!.amount.toLocaleString()}`}
                    icon={<DollarSign className="text-emerald-500" />}
                  />
                  <StatCard
                    label="Equity Offered"
                    value={`${data!.equityPercentage}%`}
                    icon={<Percent className="text-blue-500" />}
                  />
                  <StatCard
                    label="Post-Money Valuation"
                    value={`$${data!.valuation?.toLocaleString() || "N/A"}`}
                    icon={<TrendingUp className="text-purple-500" />}
                  />
                </div>
              </section>

              {/* Deal Progress (Only if deal exists) */}
              {data?.deal && (
                <section className="bg-slate-50 p-5 rounded-xl border">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Funding Progress
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Paid: ${data.deal.amountPaid.toLocaleString()} / $
                        {data.deal.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-2 bg-muted [&>div]:bg-emerald-400"
                  />
                </section>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Terms & Conditions */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <h3 className="font-bold">Key Terms</h3>
                  </div>
                  <div className="bg-white rounded-lg border p-4 text-sm text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                    {data!.terms}
                  </div>
                </section>

                {/* History/Notes */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    <h3 className="font-bold">Recent Activity</h3>
                  </div>
                  <div className="space-y-3">
                    {data?.deal?.installments.length ? (
                      data.deal.installments.map((inst, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white border rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
                              <CreditCard size={14} />
                            </div>
                            <div>
                              <p className="font-medium">
                                ${inst.amount.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {new Date(inst.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-emerald-600 bg-emerald-50 border-emerald-200"
                          >
                            {inst.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 border-2 border-dashed rounded-xl">
                        <p className="text-xs text-muted-foreground">
                          No transaction history yet
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </main>

            {/* --- Footer --- */}
            <footer className="p-6 border-t bg-slate-50/80 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                {isFounder && data!.status === OfferStatus.PENDING && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setShowRejectModal(true)}
                      disabled={accepting || rejecting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Decline Offer
                    </Button>
                    <Button
                      onClick={handleAccept}
                      disabled={accepting || rejecting}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-8"
                    >
                      {accepting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Accept & Sign
                    </Button>
                  </>
                )}

                {isInvestor &&
                  data!.status === OfferStatus.ACCEPTED &&
                  data!.deal &&
                  data!.deal.remainingAmount > 0 && (
                    <Button
                      className="w-full sm:w-auto bg-primary shadow-lg shadow-primary/20"
                      onClick={() => setShowTransferModal(true)}
                    >
                      Initiate Transfer ($
                      {data!.deal.remainingAmount.toLocaleString()})
                    </Button>
                  )}

                <Button
                  variant="outline"
                  onClick={onClose}
                  className="sm:w-auto"
                >
                  Close View
                </Button>
              </div>
            </footer>
          </div>
        </DialogContent>
      </Dialog>

      <RejectReasonModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleReject}
        title="Reject Investment Offer"
        label="Reason for rejecting this offer"
      />

      <TransferPaymentModal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onWalletPay={handleWalletPayment}
        onStripePay={handleStripePayment}
        maxAmount={data?.deal?.remainingAmount ?? 0}
      />
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-4 border-none shadow-sm bg-white ring-1 ring-slate-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-slate-50">{icon}</div>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </Card>
  );
}

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-slate-500 animate-pulse">
        Retrieving secure documents...
      </p>
    </div>
  );
}
