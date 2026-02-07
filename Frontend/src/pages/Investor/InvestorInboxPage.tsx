import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import {
  Loader2,
  MessageSquare,
  Send,
  Calendar,
  TrendingUp,
  ArrowRight,
  Inbox,
  DollarSign,
  Percent,
} from "lucide-react";

import { useFetchReceivedPitches } from "../../hooks/Pitch/pitchHooks";
import { useFetchSentInvestmentOffers } from "../../hooks/Investor/InvestmentOffer/InvestmentOfferHooks";

import { PitchDetailsModal } from "../../components/modals/PitchDetailsModal";
import { InvestmentOfferDetailsModal } from "../../components/modals/InvestmentOfferDetailsModal";

import type { PitchStatus } from "../../types/pitchType";
import type { OfferStatus } from "../../types/investmentOfferType";
import { useDebounce } from "../../hooks/Debounce/useDebounce";
import Pagination from "../../components/pagination/Pagination";

interface Pitch {
  pitchId: string;
  projectId: string;
  projectName: string;
  projectLogoUrl?: string;
  founderId: string;
  founderName: string;
  founderProfileImg?: string;
  subject: string;
  status: PitchStatus;
  createdAt: string;
}

interface Offer {
  offerId: string;
  projectId: string;
  projectName: string;
  projectLogoUrl?: string;
  founderId: string;
  founderName: string;
  founderProfileImg?: string;
  amount: number;
  equityPercentage: number;
  valuation?: number;
  status: OfferStatus;
  createdAt: string;
}
type InboxTab = "pitches" | "offers";

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `$${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}k`;
  }
  return `$${amount}`;
};

const pitchStatusConfig: Record<
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

const offerStatusConfig: Record<
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

const pitchStatusColor = (status: PitchStatus) =>
  pitchStatusConfig[status] || pitchStatusConfig.SENT;
const offerStatusColor = (status: OfferStatus) =>
  offerStatusConfig[status] || offerStatusConfig.PENDING;

/* ---------------- Page Component ---------------- */

export default function InvestorInboxPage() {
  const [selectedPitchId, setSelectedPitchId] = useState<string | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InboxTab>("pitches");
  const [pitchPage, setPitchPage] = useState(1);
  const [pitchStatus, setPitchStatus] = useState<PitchStatus | undefined>();
  const [pitchSearch, setPitchSearch] = useState("");
  const [offerPage, setOfferPage] = useState(1);
  const [offerStatus, setOfferStatus] = useState<OfferStatus | undefined>();
  const [offerSearch, setOfferSearch] = useState("");
  const debouncedPitchSearch = useDebounce(pitchSearch, 400);
  const debouncedOfferSearch = useDebounce(offerSearch, 400);
  const LIMIT = 10;
  const { data: receivedPitchesData, isLoading: loadingPitches } =
    useFetchReceivedPitches(
      pitchPage,
      LIMIT,
      pitchStatus,
      debouncedPitchSearch,
    );

  const { data: sentOffersData, isLoading: loadingOffers } =
    useFetchSentInvestmentOffers(
      offerPage,
      LIMIT,
      offerStatus,
      debouncedOfferSearch,
    );

  const pitches = receivedPitchesData?.data ?? [];
  const offers = sentOffersData?.data ?? [];

  const pitchTotalPages = Math.ceil((receivedPitchesData?.total ?? 0) / LIMIT);

  const offerTotalPages = Math.ceil((sentOffersData?.total ?? 0) / LIMIT);

  React.useEffect(() => {
    setPitchPage(1);
  }, [pitchStatus, debouncedPitchSearch]);

  React.useEffect(() => {
    setOfferPage(1);
  }, [offerStatus, debouncedOfferSearch]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-12">
        {/* ---------- Header ---------- */}
        <motion.div
          className="mb-8 xs:mb-10 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-slate-900">
              Investor Inbox
            </h1>
            <p className="text-sm xs:text-base text-slate-600">
              Manage received pitches and sent investment offers
            </p>
          </div>
        </motion.div>

        {/* ---------- Tabs Section ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs
            defaultValue="pitches"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as InboxTab)}
            className="w-full"
          >
            <TabsList className="w-full xs:w-auto mb-5 xs:mb-6 bg-slate-100 p-1 flex">
              <TabsTrigger
                value="pitches"
                className="gap-1 xs:gap-2 text-xs xs:text-sm flex-1 xs:flex-none data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-sm"
              >
                <MessageSquare className="w-3 xs:w-4 h-3 xs:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Received Pitches</span>
                <span className="sm:hidden">Pitches</span>
                {pitches.length ? (
                  <Badge
                    className="ml-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 h-5"
                    variant="secondary"
                  >
                    {pitches.length}
                  </Badge>
                ) : null}
              </TabsTrigger>

              <TabsTrigger
                value="offers"
                className="gap-1 xs:gap-2 text-xs xs:text-sm flex-1 xs:flex-none data-[state=active]:bg-white data-[state=active]:text-slate-900 shadow-sm"
              >
                <Send className="w-3 xs:w-4 h-3 xs:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Investment Offers</span>
                <span className="sm:hidden">Offers</span>
                {offers.length ? (
                  <Badge
                    className="ml-1 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 h-5"
                    variant="secondary"
                  >
                    {offers.length}
                  </Badge>
                ) : null}
              </TabsTrigger>
            </TabsList>

            {/* ================= RECEIVED PITCHES ================= */}
            <TabsContent value="pitches" className="space-y-3 xs:space-y-4">
              <input
                value={pitchSearch}
                className="border rounded px-3 py-1 text-sm"
                onChange={(e) => setPitchSearch(e.target.value)}
                placeholder="Search project..."
              />

              <select
                value={pitchStatus ?? ""}
                className="border rounded px-2 py-1 text-sm"
                onChange={(e) =>
                  setPitchStatus(
                    e.target.value
                      ? (e.target.value as PitchStatus)
                      : undefined,
                  )
                }
              >
                <option value="">All</option>
                <option value="SENT">Sent</option>
                <option value="VIEWED">Viewed</option>
                <option value="RESPONDED">Responded</option>
              </select>

              {loadingPitches ? (
                <Loader />
              ) : pitches && pitches.length > 0 ? (
                <motion.div
                  className="space-y-3 xs:space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {pitches.map((pitch, idx) => (
                    <PitchRow
                      key={pitch.pitchId}
                      pitch={pitch}
                      idx={idx}
                      onClick={() => setSelectedPitchId(pitch.pitchId)}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon={<Inbox className="w-12 h-12" />}
                  text="No pitches received yet"
                  subtext="When founders pitch to you, their pitches will appear here"
                />
              )}
            </TabsContent>

            {/* ================= SENT OFFERS ================= */}
            <TabsContent value="offers" className="space-y-3 xs:space-y-4">
              <input
                value={offerSearch}
                className="border rounded px-3 py-1 text-sm"
                onChange={(e) => setOfferSearch(e.target.value)}
                placeholder="Search project..."
              />

              <select
                value={offerStatus ?? ""}
                className="border rounded px-2 py-1 text-sm"
                onChange={(e) =>
                  setOfferStatus(
                    e.target.value
                      ? (e.target.value as OfferStatus)
                      : undefined,
                  )
                }
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="EXPIRED">Expired</option>
              </select>

              {loadingOffers ? (
                <Loader />
              ) : offers && offers.length > 0 ? (
                <motion.div
                  className="space-y-3 xs:space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {offers.map((offer, idx) => (
                    <OfferRow
                      key={offer.offerId}
                      offer={offer}
                      idx={idx}
                      onClick={() => setSelectedOfferId(offer.offerId)}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon={<Send className="w-12 h-12" />}
                  text="No investment offers sent yet"
                  subtext="Investment offers you send will appear here"
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {activeTab === "pitches" && (
          <Pagination
            currentPage={pitchPage}
            totalPages={pitchTotalPages}
            setPage={setPitchPage}
          />
        )}

        {activeTab === "offers" && (
          <Pagination
            currentPage={offerPage}
            totalPages={offerTotalPages}
            setPage={setOfferPage}
          />
        )}

        {/* ---------- Pitch Details Modal ---------- */}
        {selectedPitchId && (
          <PitchDetailsModal
            open
            pitchId={selectedPitchId}
            onClose={() => setSelectedPitchId(null)}
          />
        )}

        {/* ---------- Investment Offer Details Modal ---------- */}
        {selectedOfferId && (
          <InvestmentOfferDetailsModal
            open
            offerId={selectedOfferId}
            onClose={() => setSelectedOfferId(null)}
          />
        )}
      </div>
    </main>
  );
}

/* ================= Sub-Components ================= */

function PitchRow({
  pitch,
  idx,
  onClick,
}: {
  pitch: Pitch;
  idx: number;
  onClick: () => void;
}) {
  const statusInfo = pitchStatusColor(pitch.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div className="group p-3 xs:p-4 sm:p-5 cursor-pointer transition-all border border-slate-200 rounded-xl bg-white hover:shadow-lg hover:border-slate-300">
        <div className="flex flex-col xs:flex-row xs:items-start gap-4">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {pitch.projectLogoUrl ? (
              <img
                src={pitch.projectLogoUrl}
                alt={pitch.projectName}
                className="w-12 h-12 rounded-lg object-cover border border-slate-100 bg-slate-50"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                <Inbox className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                  {pitch.subject}
                </h3>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-800">
                    {pitch.projectName}
                  </span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span>{pitch.founderName}</span>
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition hidden sm:block" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Badge
                className={`${statusInfo.color} ${statusInfo.bgColor} text-xs border px-2 py-0.5`}
                variant="secondary"
              >
                {statusInfo.label}
              </Badge>
              <span className="text-xs text-slate-500 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(pitch.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OfferRow({
  offer,
  idx,
  onClick,
}: {
  offer: Offer;
  idx: number;
  onClick: () => void;
}) {
  const statusInfo = offerStatusColor(offer.status);
  const isAccepted = offer.status === "ACCEPTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div
        className={`group p-3 xs:p-4 sm:p-5 cursor-pointer transition-all border rounded-xl ${
          isAccepted
            ? "bg-gradient-to-r from-emerald-50/50 to-white border-emerald-200 hover:shadow-md hover:border-emerald-300"
            : "bg-white border-slate-200 hover:shadow-lg hover:border-slate-300"
        }`}
      >
        <div className="flex flex-col xs:flex-row xs:items-start gap-4">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {offer.projectLogoUrl ? (
              <img
                src={offer.projectLogoUrl}
                alt={offer.projectName}
                className="w-12 h-12 rounded-lg object-cover border border-slate-100 bg-slate-50"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                <Send className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition">
                  {offer.projectName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Founder: {offer.founderName}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge
                  className={`${statusInfo.color} ${statusInfo.bgColor} text-xs border px-2 py-0.5`}
                  variant="secondary"
                >
                  {statusInfo.label}
                </Badge>
                <span className="text-[10px] text-slate-400">
                  {new Date(offer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                <div className="flex items-center gap-1 text-slate-500 mb-1">
                  <DollarSign className="w-3 h-3" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Amount
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(offer.amount)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                <div className="flex items-center gap-1 text-slate-500 mb-1">
                  <Percent className="w-3 h-3" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Equity
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {offer.equityPercentage}%
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                <div className="flex items-center gap-1 text-slate-500 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    Valuation
                  </span>
                </div>
                {offer.valuation && (
                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(offer.valuation)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Loader() {
  return (
    <motion.div
      className="flex justify-center items-center py-16 xs:py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
    </motion.div>
  );
}

function EmptyState({
  icon,
  text,
  subtext,
}: {
  icon: React.ReactNode;
  text: string;
  subtext: string;
}) {
  return (
    <motion.div
      className="py-12 xs:py-16 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="inline-flex flex-col items-center gap-3">
        <div className="text-slate-400 bg-slate-50 p-4 rounded-full">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-base xs:text-lg font-semibold text-slate-900">
            {text}
          </h3>
          <p className="text-sm text-slate-600 max-w-xs">{subtext}</p>
        </div>
      </div>
    </motion.div>
  );
}
