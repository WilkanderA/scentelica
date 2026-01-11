export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-64 mx-auto mb-8"></div>
          <div className="h-12 bg-gray-200 rounded-lg max-w-2xl mx-auto"></div>
        </div>

        {/* Featured Fragrances Grid Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
  );
}
