import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  XCircle,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import type { PitchStatus } from "../../types/pitchType";
import type { OfferStatus } from "../../types/investmentOfferType";

interface StatusStyle {
  label: string;
  /** Full badge class — theme-safe (readable in light + dark). */
  badgeClass: string;
  Icon: LucideIcon;
}

const amber =
  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
const blue = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
const emerald =
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
const rose = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
const slate =
  "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20";

const PITCH_STATUS: Record<PitchStatus, StatusStyle> = {
  SENT: { label: "Sent", badgeClass: amber, Icon: Send },
  VIEWED: { label: "Viewed", badgeClass: blue, Icon: Eye },
  RESPONDED: { label: "Responded", badgeClass: emerald, Icon: CheckCircle2 },
};

const OFFER_STATUS: Record<OfferStatus, StatusStyle> = {
  PENDING: { label: "Pending", badgeClass: amber, Icon: Clock },
  ACCEPTED: { label: "Accepted", badgeClass: emerald, Icon: CheckCircle2 },
  REJECTED: { label: "Rejected", badgeClass: rose, Icon: XCircle },
  EXPIRED: { label: "Expired", badgeClass: slate, Icon: AlertCircle },
};

interface StatusBadgeProps {
  kind: "pitch" | "offer";
  status: PitchStatus | OfferStatus;
  /** Hide the label (icon only) — for very tight layouts. */
  iconOnly?: boolean;
  className?: string;
}

export function StatusBadge({
  kind,
  status,
  iconOnly = false,
  className,
}: StatusBadgeProps) {
  const map = (kind === "pitch" ? PITCH_STATUS : OFFER_STATUS) as Record<
    string,
    StatusStyle
  >;
  const style = map[status] ?? OFFER_STATUS.PENDING;
  const { label, badgeClass, Icon } = style;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 whitespace-nowrap px-2 py-0.5 text-xs font-medium",
        badgeClass,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {!iconOnly && label}
    </Badge>
  );
}
