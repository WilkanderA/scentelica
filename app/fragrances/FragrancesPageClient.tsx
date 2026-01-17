'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FragranceCard from "@/components/FragranceCard";

interface Fragrance {
  id: string;
  name: string;
  brand: { name: string };
  gender: string | null;
  concentration: string | null;
  ratingAvg: number | null;
  reviewCount: number;
  bottleImageUrl: string | null;
}

interface FragrancesPageClientProps {
  initialFragrances: Fragrance[];
  totalCount: number;
  search?: string;
}

export function FragrancesPageClient({ initialFragrances, totalCount, search }: FragrancesPageClientProps) {
  const searchParams = useSearchParams();
  const [fragrances, setFragrances] = useState<Fragrance[]>(initialFragrances);
  const [isLoading, setIsLoading] = useState(false);

  // Reset fragrances when filters change (initialFragrances from server changes)
  useEffect(() => {
    setFragrances(initialFragrances);
  }, [initialFragrances]);

  const loadMore = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.set('offset', fragrances.length.toString());
      params.set('limit', '50');

      // Pass through current filters
      const currentSearch = searchParams.get('search');
      const currentBrand = searchParams.get('brand');
      const currentGender = searchParams.get('gender');
      const currentSort = searchParams.get('sort');

      if (currentSearch) params.set('search', currentSearch);
      if (currentBrand) params.set('brand', currentBrand);
      if (currentGender) params.set('gender', currentGender);
      if (currentSort) params.set('sort', currentSort);

      const response = await fetch(`/api/fragrances?${params.toString()}`);
      const data = await response.json();

      if (data.fragrances) {
        setFragrances(prev => {
          const existingIds = new Set(prev.map(f => f.id));
          const newFragrances = data.fragrances.filter((f: Fragrance) => !existingIds.has(f.id));
          return [...prev, ...newFragrances];
        });
      }
    } catch (error) {
      console.error('Failed to load more fragrances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {search ? `Search results for "${search}"` : 'All Fragrances'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Showing {fragrances.length} of {totalCount} {totalCount === 1 ? 'fragrance' : 'fragrances'}
        </p>
      </div>

      {fragrances.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No fragrances found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {fragrances.map((fragrance) => (
            <FragranceCard
              key={fragrance.id}
              id={fragrance.id}
              name={fragrance.name}
              brand={fragrance.brand.name}
              gender={fragrance.gender || undefined}
              concentration={fragrance.concentration || undefined}
              ratingAvg={fragrance.ratingAvg !== null && fragrance.ratingAvg > 0 ? fragrance.ratingAvg : undefined}
              reviewCount={fragrance.reviewCount}
              bottleImageUrl={fragrance.bottleImageUrl || undefined}
            />
          ))}
        </div>
      )}

      {fragrances.length < totalCount && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-100 dark:bg-tonal-30 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-tonal-40 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}
