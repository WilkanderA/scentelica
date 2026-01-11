export default function FragrancesLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-64">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mb-4">
                  <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
