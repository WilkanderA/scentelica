import { Suspense } from "react";
import type { Metadata } from "next";
import FragranceCard from "@/components/FragranceCard";
import FilterSidebar from "@/components/FilterSidebar";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Browse Fragrances",
  description: "Explore our complete collection of fragrances. Filter by brand, gender, and notes to find your perfect scent.",
  openGraph: {
    title: "Browse Fragrances | Scentelica",
    description: "Explore our complete collection of fragrances. Filter by brand, gender, and notes to find your perfect scent.",
  },
};

interface FragrancesPageProps {
  searchParams: Promise<{
    search?: string;
    brand?: string;
    gender?: string;
    sort?: string;
  }>;
}

async function FragrancesList({ searchParams }: { searchParams: Awaited<FragrancesPageProps['searchParams']> }) {
  const { search, brand, gender, sort } = searchParams;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { name: { contains: search, mode: 'insensitive' } } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (brand) {
    where.brand = { name: brand };
  }

  if (gender) {
    where.gender = gender;
  }

  let orderBy: any = { ratingAvg: 'desc' };

  if (sort === 'name') {
    orderBy = { name: 'asc' };
  } else if (sort === 'year') {
    orderBy = { year: 'desc' };
  }

  const fragrances = await prisma.fragrance.findMany({
    where,
    include: {
      brand: true,
    },
    orderBy,
  });

  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <FilterSidebar brands={brands} />
        </aside>

        <main className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {search ? `Search results for "${search}"` : 'All Fragrances'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {fragrances.length} {fragrances.length === 1 ? 'fragrance' : 'fragrances'} found
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
              {fragrances.map((fragrance: { id: string; name: string; brand: { name: string }; gender: string | null; concentration: string | null; ratingAvg: number | null; reviewCount: number; bottleImageUrl: string | null }) => (
                <FragranceCard
                  key={fragrance.id}
                  id={fragrance.id}
                  name={fragrance.name}
                  brand={fragrance.brand.name}
                  gender={fragrance.gender || undefined}
                  concentration={fragrance.concentration || undefined}
                  ratingAvg={fragrance.ratingAvg || undefined}
                  reviewCount={fragrance.reviewCount}
                  bottleImageUrl={fragrance.bottleImageUrl || undefined}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default async function FragrancesPage(props: FragrancesPageProps) {
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <FragrancesList searchParams={searchParams} />
    </Suspense>
  );
}
