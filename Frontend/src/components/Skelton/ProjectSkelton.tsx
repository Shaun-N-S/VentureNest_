const ProjectSkeleton = () => (
  <div className="bg-white rounded-2xl border p-6 animate-pulse space-y-4">
    <div className="flex justify-between">
      <div className="space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
      <div className="h-6 w-10 bg-gray-200 rounded" />
    </div>

    <div className="h-4 w-full bg-gray-200 rounded" />
    <div className="h-4 w-5/6 bg-gray-200 rounded" />

    <div className="h-48 bg-gray-200 rounded-xl" />
  </div>
);

export default ProjectSkeleton;
