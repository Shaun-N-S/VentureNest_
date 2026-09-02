import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import {
  MessageSquare,
  Send,
  Calendar,
  TrendingUp,
  ArrowRight,
  Inbox,
  IndianRupee,
  Percent,
  Filter,
  Search,
} from "lucide-react";

import { useFetchReceivedPitches } from "../../hooks/Pitch/pitchHooks";
import { useFetchSentInvestmentOffers } from "../../hooks/Investor/InvestmentOffer/InvestmentOfferHooks";

import { PitchDetailsModal } from "../../components/modals/PitchDetailsModal";
import { InvestmentOfferDetailsModal } from "../../components/modals/InvestmentOfferDetailsModal";

import type { PitchStatus } from "../../types/pitchType";
import type { OfferStatus } from "../../types/investmentOfferType";
import { useDebounce } from "../../hooks/Debounce/useDebounce";
import Pagination from "../../components/pagination/Pagination";
import { StatusBadge } from "../../components/offers/offerStatus";
import { formatCompactCurrency } from "../../utils/currency";
import { formatCompactDate } from "../../utils/dateFormatter";

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
    <div className="flex flex-wrap items-center gap-2">
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

function RowListSkeleton() {
  return (
    <div className="space-y-3 xs:space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-xl border border-border bg-card p-3 xs:p-4 sm:p-5"
        >
          <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-32" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
    useFetchReceivedPitches(pitchPage, LIMIT, pitchStatus, debouncedPitchSearch);

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
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* ---------- Header ---------- */}
        <motion.div
          className="mb-8 xs:mb-10 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground xs:text-3xl sm:text-4xl">
              Investor Inbox
            </h1>
            <p className="text-sm text-muted-foreground xs:text-base">
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
            <TabsList className="mb-5 flex w-full bg-muted p-1 xs:mb-6 xs:w-auto">
              <TabsTrigger
                value="pitches"
                className="flex-1 gap-1.5 text-xs data-[state=active]:bg-card data-[state=active]:text-foreground xs:flex-none xs:text-sm"
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Received Pitches</span>
                <span className="sm:hidden">Pitches</span>
                {pitches.length ? (
                  <Badge className="ml-1 h-5 bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">
                    {receivedPitchesData?.total ?? pitches.length}
                  </Badge>
                ) : null}
              </TabsTrigger>

              <TabsTrigger
                value="offers"
                className="flex-1 gap-1.5 text-xs data-[state=active]:bg-card data-[state=active]:text-foreground xs:flex-none xs:text-sm"
              >
                <Send className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Investment Offers</span>
                <span className="sm:hidden">Offers</span>
                {offers.length ? (
                  <Badge className="ml-1 h-5 bg-purple-600 px-1.5 py-0.5 text-[10px] text-white">
                    {sentOffersData?.total ?? offers.length}
                  </Badge>
                ) : null}
              </TabsTrigger>
            </TabsList>

            {/* ================= RECEIVED PITCHES ================= */}
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

              {loadingPitches ? (
                <RowListSkeleton />
              ) : pitches && pitches.length > 0 ? (
                <div className="space-y-3 xs:space-y-4">
                  {pitches.map((pitch, idx) => (
                    <PitchRow
                      key={pitch.pitchId}
                      pitch={pitch}
                      idx={idx}
                      onClick={() => setSelectedPitchId(pitch.pitchId)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Inbox className="h-8 w-8" />}
                  text="No pitches received yet"
                  subtext="When founders pitch to you, their pitches will appear here."
                />
              )}
            </TabsContent>

            {/* ================= SENT OFFERS ================= */}
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
                <RowListSkeleton />
              ) : offers && offers.length > 0 ? (
                <div className="space-y-3 xs:space-y-4">
                  {offers.map((offer, idx) => (
                    <OfferRow
                      key={offer.offerId}
                      offer={offer}
                      idx={idx}
                      onClick={() => setSelectedOfferId(offer.offerId)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Send className="h-8 w-8" />}
                  text="No investment offers sent yet"
                  subtext="Investment offers you send will appear here."
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div className="group cursor-pointer rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md xs:p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Logo Section */}
          <div className="shrink-0">
            {pitch.projectLogoUrl ? (
              <img
                src={pitch.projectLogoUrl}
                alt={pitch.projectName}
                className="h-12 w-12 rounded-lg border border-border bg-muted object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Inbox className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                  {pitch.subject}
                </h3>
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {pitch.projectName}
                  </span>
                  <span className="mx-2 text-muted-foreground/40">|</span>
                  <span>{pitch.founderName}</span>
                </p>
              </div>
              <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary/60 sm:block" />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <StatusBadge kind="pitch" status={pitch.status} />
              <span className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {formatCompactDate(pitch.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OfferStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-2">
      <div className="mb-1 flex items-center gap-1 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
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
  const isAccepted = offer.status === "ACCEPTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div
        className={`group cursor-pointer rounded-xl border p-3 transition-all hover:shadow-md xs:p-4 sm:p-5 ${
          isAccepted
            ? "border-emerald-500/30 bg-emerald-500/[0.04] hover:border-emerald-500/50"
            : "border-border bg-card hover:border-primary/30"
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Logo Section */}
          <div className="shrink-0">
            {offer.projectLogoUrl ? (
              <img
                src={offer.projectLogoUrl}
                alt={offer.projectName}
                className="h-12 w-12 rounded-lg border border-border bg-muted object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Send className="h-6 w-6" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                  {offer.projectName}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  Founder: {offer.founderName}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <StatusBadge kind="offer" status={offer.status} />
                <span className="text-[10px] text-muted-foreground">
                  {formatCompactDate(offer.createdAt)}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-2 grid grid-cols-3 gap-2">
              <OfferStat
                icon={<IndianRupee className="h-3 w-3" />}
                label="Amount"
                value={formatCompactCurrency(offer.amount)}
              />
              <OfferStat
                icon={<Percent className="h-3 w-3" />}
                label="Equity"
                value={`${offer.equityPercentage}%`}
              />
              <OfferStat
                icon={<TrendingUp className="h-3 w-3" />}
                label="Valuation"
                value={
                  offer.valuation
                    ? formatCompactCurrency(offer.valuation)
                    : "—"
                }
              />
            </div>
          </div>
        </div>
      </div>
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
    <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-16 text-center sm:py-20">
      <div className="inline-flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm">
          {icon}
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-foreground">{text}</h3>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            {subtext}
          </p>
        </div>
      </div>
    </div>
  );
}
