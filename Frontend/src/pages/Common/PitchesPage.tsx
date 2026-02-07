import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Card } from "../../components/ui/card";
import { PitchDetailsModal } from "../../components/modals/PitchDetailsModal";
import { InvestmentOfferDetailsModal } from "../../components/modals/InvestmentOfferDetailsModal";
import {
  Send,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Handshake,
  TrendingUp,
  Target,
  DollarSign,
  Percent,
  Zap,
} from "lucide-react";

import type { PitchStatus } from "../../types/pitchType";
import type { OfferStatus } from "../../types/investmentOfferType";
import { useFetchReceivedInvestmentOffers } from "../../hooks/Investor/InvestmentOffer/InvestmentOfferHooks";
import { useFetchSentPitches } from "../../hooks/Pitch/pitchHooks";
import Pagination from "../../components/pagination/Pagination";
import { useDebounce } from "../../hooks/Debounce/useDebounce";

/* ---------------- Types ---------------- */

interface SentPitch {
  pitchId: string;
  projectId: string;
  projectName: string;
  projectLogoUrl?: string;
  investorId: string;
  investorName: string;
  investorProfileImg?: string;
  subject: string;
  status: PitchStatus;
  createdAt: string;
}

interface ReceivedOffer {
  offerId: string;
  projectId: string;
  projectName: string;
  projectLogoUrl?: string;
  investorId: string;
  investorName: string;
  investorProfileImg?: string;
  amount: number;
  equityPercentage: number;
  valuation?: number;
  status: OfferStatus;
  createdAt: string;
}

type ActiveTab = "offers" | "pitches";

/* ---------------- Status Configs ---------------- */

const pitchStatusConfig: Record<
  PitchStatus,
  { color: string; icon: React.ReactNode; label: string }
> = {
  SENT: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Send className="w-3 h-3" />,
    label: "Sent",
  },
  VIEWED: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Eye className="w-3 h-3" />,
    label: "Viewed",
  },
  RESPONDED: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
    label: "Responded",
  },
};

const offerStatusConfig: Record<
  OfferStatus,
  { color: string; icon: React.ReactNode; label: string }
> = {
  PENDING: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="w-3 h-3" />,
    label: "Pending",
  },
  ACCEPTED: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
    label: "Accepted",
  },
  REJECTED: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="w-3 h-3" />,
    label: "Rejected",
  },
  EXPIRED: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: <AlertCircle className="w-3 h-3" />,
    label: "Expired",
  },
};

export default function PitchesPage() {
  const [selectedPitchId, setSelectedPitchId] = useState<string | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [pitchStatus, setPitchStatus] = useState<PitchStatus | undefined>();
  const [offerStatus, setOfferStatus] = useState<OfferStatus | undefined>();
  const [pitchSearch, setPitchSearch] = useState("");
  const [offerSearch, setOfferSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("offers");
  const [offerPage, setOfferPage] = useState(1);
  const [pitchPage, setPitchPage] = useState(1);
  const debouncedPitchSearch = useDebounce(pitchSearch, 400);
  const debouncedOfferSearch = useDebounce(offerSearch, 400);

  const LIMIT = 5;

  const { data: receivedOffersData, isLoading: loadingOffers } =
    useFetchReceivedInvestmentOffers(
      offerPage,
      LIMIT,
      offerStatus,
      debouncedOfferSearch,
    );

  const { data: sentPitchesData, isLoading: loadingSent } = useFetchSentPitches(
    pitchPage,
    LIMIT,
    pitchStatus,
    debouncedPitchSearch,
  );

  const offers = receivedOffersData?.data ?? [];
  const pitches = sentPitchesData?.data ?? [];
  console.log(receivedOffersData, sentPitchesData);

  React.useEffect(() => {
    setPitchPage(1);
  }, [pitchStatus, debouncedPitchSearch]);

  React.useEffect(() => {
    setOfferPage(1);
  }, [offerStatus, debouncedOfferSearch]);

  const offerTotalPages = Math.ceil((receivedOffersData?.total ?? 0) / LIMIT);

  const pitchTotalPages = Math.ceil((sentPitchesData?.total ?? 0) / LIMIT);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-12">
        {/* Header Section */}
        <motion.div
          className="mb-8 xs:mb-10 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2 mb-6 xs:mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-slate-900">
              Pitches & Offers
            </h1>
            <p className="text-sm xs:text-base text-slate-600">
              Track your fundraising progress across pitches and investment
              offers
            </p>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              if (value === "offers" || value === "pitches") {
                setActiveTab(value);
              }
            }}
            className="w-full"
          >
            <TabsList className="w-full xs:w-auto mb-5 xs:mb-6 bg-slate-100 p-1 flex">
              <TabsTrigger
                value="offers"
                className="gap-1 xs:gap-2 text-xs xs:text-sm flex-1 xs:flex-none data-[state=active]:bg-white data-[state=active]:text-slate-900"
              >
                <Handshake className="w-3 xs:w-4 h-3 xs:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Investment Offers</span>
                <span className="sm:hidden">Offers</span>
                {offers.length > 0 && (
                  <Badge
                    className="ml-1 bg-purple-600 text-white text-xs"
                    variant="secondary"
                  >
                    {receivedOffersData?.total ?? 0}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="pitches"
                className="gap-1 xs:gap-2 text-xs xs:text-sm flex-1 xs:flex-none data-[state=active]:bg-white data-[state=active]:text-slate-900"
              >
                <Send className="w-3 xs:w-4 h-3 xs:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Sent Pitches</span>
                <span className="sm:hidden">Pitches</span>
                {pitches.length > 0 && (
                  <Badge
                    className="ml-1 bg-blue-600 text-white text-xs"
                    variant="secondary"
                  >
                    {sentPitchesData?.total ?? 0}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Offers Tab - Featured First */}
            <TabsContent value="offers" className="space-y-4">
              <div className="flex gap-3 mb-4">
                <input
                  placeholder="Search project..."
                  className="border rounded px-3 py-1 text-sm"
                  value={offerSearch}
                  onChange={(e) => setOfferSearch(e.target.value)}
                />

                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={offerStatus ?? ""}
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
              </div>
              {loadingOffers ? (
                <LoadingState />
              ) : offers.length > 0 ? (
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <OfferCard
                      key={offer.offerId}
                      offer={offer}
                      onClick={() => setSelectedOfferId(offer.offerId)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Handshake className="w-12 h-12" />}
                  title="No Investment Offers Yet"
                  description="When investors respond to your pitches, their offers will appear here"
                />
              )}
            </TabsContent>

            {/* Pitches Tab */}
            <TabsContent value="pitches" className="space-y-4">
              <div className="flex gap-3 mb-4">
                <input
                  placeholder="Search project..."
                  className="border rounded px-3 py-1 text-sm"
                  value={pitchSearch}
                  onChange={(e) => setPitchSearch(e.target.value)}
                />

                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={pitchStatus ?? ""}
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
              </div>
              {loadingSent ? (
                <LoadingState />
              ) : pitches.length > 0 ? (
                <div className="space-y-4">
                  {pitches.map((pitch) => (
                    <PitchCard
                      key={pitch.pitchId}
                      pitch={pitch}
                      onClick={() => setSelectedPitchId(pitch.pitchId)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Send className="w-12 h-12" />}
                  title="No Pitches Sent Yet"
                  description="Start by creating and sending pitches to potential investors"
                />
              )}
            </TabsContent>
          </Tabs>

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

          {/* Modals */}
          {selectedPitchId && (
            <PitchDetailsModal
              open
              pitchId={selectedPitchId}
              onClose={() => setSelectedPitchId(null)}
            />
          )}

          {selectedOfferId && (
            <InvestmentOfferDetailsModal
              open
              offerId={selectedOfferId}
              onClose={() => setSelectedOfferId(null)}
            />
          )}
        </motion.div>
      </div>
    </main>
  );
}

/* ================= Components ================= */

function PitchCard({
  pitch,
  onClick,
}: {
  pitch: SentPitch;
  onClick: () => void;
}) {
  const statusInfo = pitchStatusConfig[pitch.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      <Card
        onClick={onClick}
        className="group p-3 xs:p-4 sm:p-5 cursor-pointer transition-all hover:shadow-lg hover:border-slate-300 border-slate-200 bg-white"
      >
        <div className="flex items-start gap-4">
          {/* Project Avatar */}
          <Avatar className="h-12 w-12 ring-2 ring-slate-100 flex-shrink-0">
            <AvatarImage
              src={pitch.projectLogoUrl || "/placeholder.svg"}
              alt={pitch.projectName}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 font-bold text-sm">
              {pitch.projectName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {pitch.subject}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-1">
                {pitch.projectName} <span className="text-slate-400">→</span>{" "}
                {pitch.investorName}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap pt-1">
              <Badge
                className={`gap-1.5 text-xs font-medium px-2 py-0.5 border ${statusInfo.color}`}
                variant="outline"
              >
                {statusInfo.icon}
                {statusInfo.label}
              </Badge>
              <span className="text-xs text-slate-500">
                {new Date(pitch.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year:
                    new Date(pitch.createdAt).getFullYear() !==
                    new Date().getFullYear()
                      ? "numeric"
                      : undefined,
                })}
              </span>
            </div>
          </div>

          {/* Investor Avatar + Arrow */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Avatar className="h-10 w-10 ring-2 ring-slate-100 hidden sm:block">
              <AvatarImage
                src={pitch.investorProfileImg || "/placeholder.svg"}
                alt={pitch.investorName}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 font-bold text-xs">
                {pitch.investorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Target className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0 hidden sm:block" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function OfferCard({
  offer,
  onClick,
}: {
  offer: ReceivedOffer;
  onClick: () => void;
}) {
  const statusInfo = offerStatusConfig[offer.status];
  const isAccepted = offer.status === "ACCEPTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      <div
        onClick={onClick}
        className={`group p-3 xs:p-4 sm:p-5 cursor-pointer transition-all border-2 rounded-lg ${
          isAccepted
            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-lg hover:border-green-300"
            : "bg-white border-slate-200 hover:shadow-lg hover:border-slate-300"
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Project Avatar */}
          <Avatar className="h-12 w-12 ring-2 ring-slate-100 flex-shrink-0">
            <AvatarImage
              src={offer.projectLogoUrl || "/placeholder.svg"}
              alt={offer.projectName}
            />
            <AvatarFallback className="bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 font-bold text-sm">
              {offer.projectName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-slate-900 group-hover:text-green-600 transition-colors line-clamp-1">
                {offer.projectName}
              </h3>
              <p className="text-sm text-slate-600">
                from{" "}
                <span className="font-medium text-slate-900">
                  {offer.investorName}
                </span>
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white bg-opacity-60">
                <div className="text-slate-500 mb-1">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-900">
                  ${(offer.amount / 1000000).toFixed(1)}M
                </span>
                <span className="text-xs text-slate-500 mt-0.5 text-center">
                  Investment
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white bg-opacity-60">
                <div className="text-slate-500 mb-1">
                  <Percent className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-900">
                  {offer.equityPercentage}%
                </span>
                <span className="text-xs text-slate-500 mt-0.5 text-center">
                  Equity
                </span>
              </div>
              {offer.valuation && (
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white bg-opacity-60">
                  <div className="text-slate-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-900">
                    ${(offer.valuation / 1000000).toFixed(0)}M
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5 text-center">
                    Valuation
                  </span>
                </div>
              )}
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white bg-opacity-60">
                <Badge
                  className={`gap-1 text-xs font-medium whitespace-nowrap ${statusInfo.color}`}
                  variant="outline"
                >
                  {statusInfo.icon}
                  <span className="hidden sm:inline">{statusInfo.label}</span>
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>
                {new Date(offer.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year:
                    new Date(offer.createdAt).getFullYear() !==
                    new Date().getFullYear()
                      ? "numeric"
                      : undefined,
                })}
              </span>
            </div>
          </div>

          {/* Investor Avatar + Icon */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Avatar className="h-10 w-10 ring-2 ring-slate-100 hidden sm:block">
              <AvatarImage
                src={offer.investorProfileImg || "/placeholder.svg"}
                alt={offer.investorName}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 font-bold text-xs">
                {offer.investorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isAccepted && (
              <Zap className="w-5 h-5 text-green-600 flex-shrink-0 hidden sm:block" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="w-12 h-12 border-3 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      <p className="text-sm text-slate-600 font-medium">Loading your data...</p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="py-16 sm:py-20 px-6 border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 max-w-xs">{description}</p>
        </div>
      </div>
    </div>
  );
}
