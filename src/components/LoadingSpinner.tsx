export default function SkeletonLoader({ type = "grid", count = 12 }: { type?: "grid" | "details" | "hero"; count?: number }) {
  if (type === "details") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
        <div className="h-[40vh] bg-gray-300 dark:bg-gray-700"></div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-3">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
              </div>
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "hero") {
    return (
      <div className="animate-pulse">
        <div className="h-[400px] bg-gray-300 dark:bg-gray-700 rounded-lg mb-8"></div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            {/* Image skeleton */}
            <div className="h-40 bg-gray-300 dark:bg-gray-700"></div>
            {/* Content skeleton */}
            <div className="p-4 space-y-2">
              {/* Year and rating row */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              </div>
              {/* Title */}
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}