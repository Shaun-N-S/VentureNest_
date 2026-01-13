import { Skeleton } from "../ui/skeleton";

export const ReportModalSkeleton = () => {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border-b">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
};
