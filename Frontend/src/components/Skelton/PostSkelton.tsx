const PostSkeleton = () => (
  <div className="bg-white rounded-lg border p-4 animate-pulse space-y-3">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="h-4 w-full bg-gray-200 rounded" />
    <div className="h-4 w-5/6 bg-gray-200 rounded" />
  </div>
);
export default PostSkeleton;