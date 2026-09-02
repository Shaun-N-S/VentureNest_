import { Skeleton } from "../../components/ui/skeleton";

export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:py-12">
        {/* Hero */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Skeleton className="h-40 w-full rounded-none sm:h-52" />
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <Skeleton className="-mt-10 mb-4 h-20 w-20 rounded-2xl sm:-mt-12 sm:h-24 sm:w-24" />
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-40" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
              <div className="flex gap-2.5">
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border border-border bg-card p-4"
            >
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>

        {/* Sections */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
          >
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
