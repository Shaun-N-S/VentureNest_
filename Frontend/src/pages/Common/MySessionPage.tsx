import { useMemo, useState } from "react";
import { SessionStatus, type SessionDTO } from "../../types/session";
import { useGetInvestorTickets } from "../../hooks/Ticket/ticketHook";
import { SessionCard } from "../../components/card/SessionCard";
import { Calendar, CheckCircle2 } from "lucide-react";

type Tab = "UPCOMING" | "COMPLETED";

interface FlattenedSession {
  session: SessionDTO;
  projectName: string;
  founder: {
    id: string;
    name: string;
    profileImg?: string;
  };
}

export default function MySessionsPage() {
  const { data, isLoading } = useGetInvestorTickets();
  const [tab, setTab] = useState<Tab>("UPCOMING");

  const sessions = useMemo<FlattenedSession[]>(() => {
    if (!data) return [];

    return data.flatMap((ticket) =>
      ticket.sessions.map((session) => ({
        session,
        projectName: ticket.project.startupName,
        founder: ticket.founder,
      })),
    );
  }, [data]);

  const filtered = sessions.filter(({ session }) =>
    tab === "UPCOMING"
      ? session.status === SessionStatus.SCHEDULED
      : session.status === SessionStatus.COMPLETED,
  );

  const upcomingCount = sessions.filter(
    ({ session }) => session.status === SessionStatus.SCHEDULED,
  ).length;

  const completedCount = sessions.filter(
    ({ session }) => session.status === SessionStatus.COMPLETED,
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="space-y-8">
          {/* HEADER SECTION */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                My Sessions
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage and track all your scheduled and completed sessions
              </p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{upcomingCount}</p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedCount}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB SWITCHER */}
            <div className="flex items-center justify-between">
              <div className="inline-flex bg-muted/50 backdrop-blur-sm rounded-full p-1 border shadow-sm">
                {(["UPCOMING", "COMPLETED"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`
                      relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                      ${
                        tab === t
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {t === "UPCOMING" ? "Upcoming" : "Completed"}
                    {tab === t && (
                      <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                {filtered.length}{" "}
                {filtered.length === 1 ? "session" : "sessions"}
              </div>
            </div>
          </div>

          {/* SESSIONS GRID */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                {tab === "UPCOMING" ? (
                  <Calendar className="w-10 h-10 text-muted-foreground" />
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground/80">
                  No {tab.toLowerCase()} sessions
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tab === "UPCOMING"
                    ? "You don't have any upcoming sessions scheduled"
                    : "You haven't completed any sessions yet"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {filtered.map(({ session, projectName, founder }) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  projectName={projectName}
                  founder={founder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
