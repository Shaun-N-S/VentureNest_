export function CommentSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="h-8 w-8 rounded-full bg-gray-300" />

      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 bg-gray-300 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
