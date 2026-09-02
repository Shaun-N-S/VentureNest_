import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Users } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { VerifiedBadge } from "../Comments/VerifiedBadge";
import { ProjectSection } from "./ProjectSection";

export interface FounderItem {
  id: string;
  name: string;
  image: string;
  initials: string;
  userRole: string;
}

interface Props {
  founders: FounderItem[];
  verified?: boolean;
}

const titleCase = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export function ProjectFounders({ founders, verified }: Props) {
  const navigate = useNavigate();

  return (
    <ProjectSection title="Founders" icon={Users}>
      <div className="grid gap-3 sm:grid-cols-2">
        {founders.map((founder) => {
          const open = () => navigate(`/profile/${founder.id}`);
          return (
            <button
              key={founder.id}
              type="button"
              onClick={open}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open();
                }
              }}
              className="group flex w-full items-center gap-4 rounded-xl border border-border bg-secondary/40 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="h-14 w-14 ring-2 ring-primary/10 ring-offset-2 ring-offset-card">
                <AvatarImage
                  src={founder.image || "/placeholder.svg"}
                  alt={founder.name}
                />
                <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                  {founder.initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                  {founder.name}
                  {verified && <VerifiedBadge size={15} />}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {titleCase(founder.userRole || "Founder")}
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
    </ProjectSection>
  );
}
