import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search, TriangleAlert, Users, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";
import { useDebounce } from "../../hooks/Debounce/useDebounce";
import { useInfiniteProjectInvestors } from "../../hooks/Project/projectHooks";
import type { ProjectInvestor } from "../../types/projectInvestorType";
import type { InvestorAccessTier } from "./investorAccess";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  /** Only "FULL" and "PARTIAL" open this modal. "FULL" also shows amount + status + date. */
  accessTier: Extract<InvestorAccessTier, "FULL" | "PARTIAL">;
}

const PAGE_SIZE = 20;

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const statusStyle = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-success/10 text-success border-success/20";
    case "PARTIALLY_PAID":
      return "bg-primary/10 text-primary border-primary/20";
    case "CANCELLED":
    case "REFUNDED":
    case "DEFAULTED":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

function InvestorRow({
  investor,
  showAdminFields,
}: {
  investor: ProjectInvestor;
  showAdminFields: boolean;
}) {
  const navigate = useNavigate();
  const openProfile = () =>
    navigate(`/investor/profile/${investor.investorId}`);

  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary/50">
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
        <Avatar className="h-11 w-11 border border-border">
          {investor.avatar && (
            <AvatarImage src={investor.avatar} alt={investor.name} />
          )}
          <AvatarFallback className="text-xs font-semibold">
            {initials(investor.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {investor.name}
          </p>
          {investor.companyName && (
            <p className="truncate text-xs text-muted-foreground">
              {investor.companyName}
            </p>
          )}
          {showAdminFields && (
            <p className="text-[11px] text-muted-foreground">
              {format(new Date(investor.since), "dd MMM yyyy")}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold text-foreground">
          {investor.equityPercentage}% Equity
        </span>
        {showAdminFields && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              ₹{investor.investedAmount.toLocaleString("en-IN")}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyle(
                investor.status,
              )}`}
            >
              {investor.status.replace(/_/g, " ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <Skeleton className="h-11 w-11 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export default function InvestorListModal({
  open,
  onOpenChange,
  projectId,
  accessTier,
}: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400).trim();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteProjectInvestors(projectId, PAGE_SIZE, open, debouncedSearch);

  const investors = useMemo(
    () => data?.pages.flatMap((p) => p.investors) ?? [],
    [data],
  );
  const total = data?.pages[0]?.total ?? 0;
  const showAdminFields = accessTier === "FULL";

  // Reloading for a new search term (page 1 not yet in cache).
  const isSearching = isFetching && !isFetchingNextPage && investors.length === 0;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight - 24 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Investors
              {total > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({total})
                </span>
              )}
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="border-b px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search investors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div
          className="max-h-[440px] space-y-1 overflow-y-auto px-4 py-3"
          onScroll={handleScroll}
        >
          {(isLoading || isSearching) && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </>
          )}

          {!isLoading && !isSearching && isError && (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
              <TriangleAlert className="h-7 w-7 text-destructive/70" />
              <p className="text-sm font-medium">Couldn't load investors</p>
              <p className="text-xs">Please close and try again.</p>
            </div>
          )}

          {!isLoading && !isSearching && !isError && investors.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <Users className="h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">
                {debouncedSearch ? "No matching investors" : "No investors yet"}
              </p>
              {!debouncedSearch && (
                <p className="text-xs">
                  Investors appear here once they fund this project.
                </p>
              )}
            </div>
          )}

          {!isLoading &&
            !isSearching &&
            !isError &&
            investors.map((investor, i) => (
              <InvestorRow
                key={`${investor.investorId}-${i}`}
                investor={investor}
                showAdminFields={showAdminFields}
              />
            ))}

          {isFetchingNextPage && (
            <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more…
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
