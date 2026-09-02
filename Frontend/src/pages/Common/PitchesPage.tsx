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
import { Input } from "../../components/ui/input";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Card } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { PitchDetailsModal } from "../../components/modals/PitchDetailsModal";
import { InvestmentOfferDetailsModal } from "../../components/modals/InvestmentOfferDetailsModal";
import {
  Send,
  Handshake,
  TrendingUp,
  Target,
  IndianRupee,
  Percent,
  Zap,
  Filter,
  Search,
} from "lucide-react";

import type { PitchStatus } from "../../types/pitchType";
import type { OfferStatus } from "../../types/investmentOfferType";
import { useFetchReceivedInvestmentOffers } from "../../hooks/Investor/InvestmentOffer/InvestmentOfferHooks";
import { useFetchSentPitches } from "../../hooks/Pitch/pitchHooks";
import Pagination from "../../components/pagination/Pagination";
import { useDebounce } from "../../hooks/Debounce/useDebounce";
import { StatusBadge } from "../../components/offers/offerStatus";
import { formatCompactCurrency } from "../../utils/currency";
import { formatCompactDate } from "../../utils/dateFormatter";

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

/* ---------------- Shared bits ---------------- */

function FilterBar({
  search,
  onSearch,
  status,
  onStatus,
  options,
}: {
  search: string;
  onSearch: (v: string) => void;
  status: string;
  onStatus: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search project..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="h-10 pl-9"
        />
      </div>
      <div className="relative">
        <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="h-10 rounded-md border border-input bg-transparent pl-9 pr-8 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function CardListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 sm:p-5"
        >
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
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
    <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-16 sm:py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm">
          {icon}
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

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

  React.useEffect(() => {
    setPitchPage(1);
  }, [pitchStatus, debouncedPitchSearch]);

  React.useEffect(() => {
    setOfferPage(1);
  }, [offerStatus, debouncedOfferSearch]);

  const offerTotalPages = Math.ceil((receivedOffersData?.total ?? 0) / LIMIT);

  const pitchTotalPages = Math.ceil((sentPitchesData?.total ?? 0) / LIMIT);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 xs:mb-10 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground xs:text-3xl sm:text-4xl">
              Pitches &amp; Offers
            </h1>
            <p className="text-sm text-muted-foreground xs:text-base">
              Track your fundraising progress across pitches and investment
              offers
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
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
            <TabsList className="mb-5 flex w-full bg-muted p-1 xs:mb-6 xs:w-auto">
              <TabsTrigger
                value="offers"
                className="flex-1 gap-1.5 text-xs data-[state=active]:bg-card data-[state=active]:text-foreground xs:flex-none xs:text-sm"
              >
                <Handshake className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Investment Offers</span>
                <span className="sm:hidden">Offers</span>
                {offers.length > 0 && (
                  <Badge className="ml-1 bg-purple-600 text-xs text-white">
                    {receivedOffersData?.total ?? 0}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="pitches"
                className="flex-1 gap-1.5 text-xs data-[state=active]:bg-card data-[state=active]:text-foreground xs:flex-none xs:text-sm"
              >
                <Send className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Sent Pitches</span>
                <span className="sm:hidden">Pitches</span>
                {pitches.length > 0 && (
                  <Badge className="ml-1 bg-blue-600 text-xs text-white">
                    {sentPitchesData?.total ?? 0}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Offers */}
            <TabsContent value="offers" className="space-y-4">
              <FilterBar
                search={offerSearch}
                onSearch={setOfferSearch}
                status={offerStatus ?? ""}
                onStatus={(v) =>
                  setOfferStatus(v ? (v as OfferStatus) : undefined)
                }
                options={[
                  { value: "", label: "All statuses" },
                  { value: "PENDING", label: "Pending" },
                  { value: "ACCEPTED", label: "Accepted" },
                  { value: "REJECTED", label: "Rejected" },
                  { value: "EXPIRED", label: "Expired" },
                ]}
              />
              {loadingOffers ? (
                <CardListSkeleton />
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
                  icon={<Handshake className="h-8 w-8" />}
                  title="No investment offers yet"
                  description="When investors respond to your pitches, their offers will appear here."
                />
              )}
            </TabsContent>

            {/* Pitches */}
            <TabsContent value="pitches" className="space-y-4">
              <FilterBar
                search={pitchSearch}
                onSearch={setPitchSearch}
                status={pitchStatus ?? ""}
                onStatus={(v) =>
                  setPitchStatus(v ? (v as PitchStatus) : undefined)
                }
                options={[
                  { value: "", label: "All statuses" },
                  { value: "SENT", label: "Sent" },
                  { value: "VIEWED", label: "Viewed" },
                  { value: "RESPONDED", label: "Responded" },
                ]}
              />
              {loadingSent ? (
                <CardListSkeleton />
              ) : pitches.length > 0 ? (
                <div className="space-y-3">
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
                  icon={<Send className="h-8 w-8" />}
                  title="No pitches sent yet"
                  description="Start by creating and sending pitches to potential investors."
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

/* ================= Cards ================= */

function PitchCard({
  pitch,
  onClick,
}: {
  pitch: SentPitch;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      <Card
        onClick={onClick}
        className="group cursor-pointer border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md sm:p-5"
      >
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 shrink-0 ring-2 ring-border">
            <AvatarImage
              src={pitch.projectLogoUrl || "/placeholder.svg"}
              alt={pitch.projectName}
            />
            <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
              {pitch.projectName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="space-y-1">
              <h3 className="line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                {pitch.subject}
              </h3>
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {pitch.projectName}{" "}
                <span className="text-muted-foreground/50">→</span>{" "}
                {pitch.investorName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge kind="pitch" status={pitch.status} />
              <span className="text-xs text-muted-foreground">
                {formatCompactDate(pitch.createdAt)}
              </span>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <Avatar className="h-10 w-10 ring-2 ring-border">
              <AvatarImage
                src={pitch.investorProfileImg || "/placeholder.svg"}
                alt={pitch.investorName}
              />
              <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                {pitch.investorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Target className="h-5 w-5 text-muted-foreground/40 transition-colors group-hover:text-primary/60" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/40 p-2.5 text-center">
      <span className="mb-1 text-muted-foreground">{icon}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
      <span className="mt-0.5 text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

function OfferCard({
  offer,
  onClick,
}: {
  offer: ReceivedOffer;
  onClick: () => void;
}) {
  const isAccepted = offer.status === "ACCEPTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      <Card
        onClick={onClick}
        className={`group cursor-pointer p-4 transition-all hover:shadow-md sm:p-5 ${
          isAccepted
            ? "border-emerald-500/30 bg-emerald-500/[0.04] hover:border-emerald-500/50"
            : "border-border bg-card hover:border-primary/30"
        }`}
      >
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 shrink-0 ring-2 ring-border">
            <AvatarImage
              src={offer.projectLogoUrl || "/placeholder.svg"}
              alt={offer.projectName}
            />
            <AvatarFallback className="bg-emerald-500/10 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {offer.projectName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-0.5">
                <h3 className="line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                  {offer.projectName}
                </h3>
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  from{" "}
                  <span className="font-medium text-foreground">
                    {offer.investorName}
                  </span>
                </p>
              </div>
              {isAccepted && (
                <Zap className="hidden h-5 w-5 shrink-0 text-emerald-500 sm:block" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric
                icon={<IndianRupee className="h-4 w-4" />}
                value={formatCompactCurrency(offer.amount)}
                label="Investment"
              />
              <Metric
                icon={<Percent className="h-4 w-4" />}
                value={`${offer.equityPercentage}%`}
                label="Equity"
              />
              <Metric
                icon={<TrendingUp className="h-4 w-4" />}
                value={
                  offer.valuation ? formatCompactCurrency(offer.valuation) : "—"
                }
                label="Valuation"
              />
              <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/40 p-2.5">
                <StatusBadge kind="offer" status={offer.status} />
                <span className="mt-1.5 text-[11px] text-muted-foreground">
                  {formatCompactDate(offer.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <Avatar className="hidden h-10 w-10 shrink-0 ring-2 ring-border sm:block">
            <AvatarImage
              src={offer.investorProfileImg || "/placeholder.svg"}
              alt={offer.investorName}
            />
            <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
              {offer.investorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </Card>
    </motion.div>
  );
}
