import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowRight,
  Check,
  Lock,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { useProjectInvestors } from "../../hooks/Project/projectHooks";
import type { ProjectInvestor } from "../../types/projectInvestorType";
import type { InvestorAccessTier } from "./investorAccess";
import { ProjectSection } from "./ProjectSection";
import InvestorListModal from "./InvestorListModal";

interface Props {
  projectId: string;
  accessTier: InvestorAccessTier;
  /** Reports the resolved investor count so the page can render an "Investors" metric. */
  onCount?: (count: number) => void;
}

/** Only a single investor is previewed on the page — the full list lives in the modal. */
const PREVIEW_LIMIT = 1;

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

function CountChip({ count }: { count: number }) {
  return (
    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {count} {count === 1 ? "investor" : "investors"}
    </span>
  );
}

function PreviewRow({
  investor,
  showAmount,
}: {
  investor: ProjectInvestor;
  showAmount: boolean;
}) {
  const navigate = useNavigate();
  const openProfile = () =>
    navigate(`/investor/profile/${investor.investorId}`);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4">
      <div
        role="button"
        tabIndex={0}
        onClick={openProfile}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProfile();
          }
        }}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="h-12 w-12 border border-border">
          {investor.avatar && (
            <AvatarImage src={investor.avatar} alt={investor.name} />
          )}
          <AvatarFallback className="text-sm font-semibold">
            {initials(investor.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {investor.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {investor.companyName ??
              `Since ${format(new Date(investor.since), "MMM yyyy")}`}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-foreground">
          {investor.equityPercentage}% Equity
        </p>
        {showAmount && (
          <p className="text-[11px] text-muted-foreground">
            ₹{investor.investedAmount.toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
}

export default function InvestorInsightsCard({
  projectId,
  accessTier,
  onCount,
}: Props) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  // Viewers without investor-insight access (LOCKED) must NOT hit the investor
  // endpoint at all — disabling the query means fetchProjectInvestors is never called.
  const hasAccess = accessTier !== "LOCKED";

  const { data, isLoading, isError } = useProjectInvestors(
    projectId,
    1,
    PREVIEW_LIMIT,
    hasAccess,
  );

  const total = data?.total;
  const preview = data?.investors ?? [];
  const showAmount = accessTier === "FULL";

  useEffect(() => {
    if (typeof total === "number") onCount?.(total);
  }, [total, onCount]);

  const wrap = (children: React.ReactNode) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );

  /* ---------------- LOCKED — premium upsell (no investor API call) --------------- */
  if (accessTier === "LOCKED") {
    return wrap(
      <ProjectSection title="Investor Insights" icon={Lock}>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          {/* Blurred investor cards behind the glass */}
          <div
            aria-hidden
            className="pointer-events-none space-y-3 p-5 blur-[6px] select-none"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4"
              >
                <div className="h-11 w-11 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-40 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
                <div className="h-4 w-14 rounded bg-muted" />
              </div>
            ))}
          </div>

          {/* Glass overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/75 px-6 py-8 text-center backdrop-blur-[2px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <p className="text-base font-bold text-foreground">
              Investors have backed this startup
            </p>

            <ul className="space-y-1.5 text-left text-xs text-muted-foreground">
              {[
                "Investor identities",
                "Equity ownership",
                "Investor network visibility",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-success" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-1 flex flex-col items-center gap-1.5">
              <Button
                className="gap-2 rounded-xl"
                onClick={() => navigate("/plans")}
              >
                <Sparkles className="h-4 w-4" />
                Unlock Investor Insights
              </Button>
              <button
                type="button"
                onClick={() => navigate("/plans")}
                className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </ProjectSection>,
    );
  }

  /* ---------------- loading ---------------- */
  if (isLoading) {
    return wrap(
      <ProjectSection title="Investor Insights" icon={TrendingUp}>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="mx-auto mt-3 h-4 w-40" />
      </ProjectSection>,
    );
  }

  /* ---------------- error ---------------- */
  if (isError) {
    return wrap(
      <ProjectSection title="Investor Insights" icon={TrendingUp}>
        <p className="rounded-xl border border-border bg-secondary/40 py-8 text-center text-sm text-muted-foreground">
          Could not load investor insights.
        </p>
      </ProjectSection>,
    );
  }

  /* ---------------- FULL / PARTIAL — single preview + open modal ---------------- */
  const count = total ?? 0;

  return (
    <>
      {wrap(
        <ProjectSection
          title="Investor Insights"
          icon={TrendingUp}
          action={count > 0 ? <CountChip count={count} /> : undefined}
        >
          {count === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-secondary/30 py-10 text-muted-foreground">
              <Users className="h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">No investors yet</p>
              <p className="text-xs">
                Investors appear here once they fund this project.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {preview.slice(0, PREVIEW_LIMIT).map((investor) => (
                <PreviewRow
                  key={investor.investorId}
                  investor={investor}
                  showAmount={showAmount}
                />
              ))}

              <Button
                variant="ghost"
                onClick={() => setModalOpen(true)}
                className="w-full justify-center gap-1.5 text-sm font-semibold text-primary hover:text-primary"
              >
                View all {count} {count === 1 ? "investor" : "investors"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </ProjectSection>,
      )}

      {(accessTier === "FULL" || accessTier === "PARTIAL") && (
        <InvestorListModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          projectId={projectId}
          accessTier={accessTier}
        />
      )}
    </>
  );
}
