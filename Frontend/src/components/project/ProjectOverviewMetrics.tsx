import type { ElementType } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Building2,
  CalendarClock,
  Heart,
  Layers,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

interface Props {
  investorCount?: number;
  stage?: string;
  category?: string;
  teamSize?: string;
  registrationStatus?: string | null;
  isActive?: boolean;
  likeCount?: number;
  listedOn?: string | null;
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: ElementType;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1.5 truncate text-lg font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

const verificationLabel = (status?: string | null) => {
  switch (status) {
    case "APPROVED":
      return "Verified";
    case "PENDING":
      return "Pending";
    case "REJECTED":
      return "Rejected";
    default:
      return "Unverified";
  }
};

export function ProjectOverviewMetrics({
  investorCount,
  stage,
  category,
  teamSize,
  registrationStatus,
  isActive,
  likeCount,
  listedOn,
}: Props) {
  const metrics: { label: string; value: string | number; icon: ElementType }[] =
    [];

  if (typeof investorCount === "number") {
    metrics.push({ label: "Investors", value: investorCount, icon: Users });
  }
  if (stage) metrics.push({ label: "Stage", value: stage, icon: TrendingUp });
  if (category)
    metrics.push({ label: "Industry", value: category, icon: Building2 });
  if (teamSize)
    metrics.push({ label: "Team", value: teamSize, icon: Layers });
  metrics.push({
    label: "Verification",
    value: verificationLabel(registrationStatus),
    icon: ShieldCheck,
  });
  metrics.push({
    label: "Status",
    value: isActive === false ? "Inactive" : "Active",
    icon: Activity,
  });
  if (typeof likeCount === "number")
    metrics.push({ label: "Interest", value: likeCount, icon: Heart });
  if (listedOn)
    metrics.push({ label: "Listed", value: listedOn, icon: CalendarClock });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </motion.div>
  );
}
