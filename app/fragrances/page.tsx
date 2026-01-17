import { Suspense } from "react";
import type { Metadata } from "next";
import FilterSidebar from "@/components/FilterSidebar";
import { FragrancesPageClient } from "./FragrancesPageClient";
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
    limit?: string;
  }>;
}

async function FragrancesList({ searchParams }: { searchParams: Awaited<FragrancesPageProps['searchParams']> }) {
  const { search, brand, gender, sort, limit } = searchParams;
  const limitNum = limit ? parseInt(limit) : 50;

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

  let orderBy: any = [
    { ratingAvg: { sort: 'desc', nulls: 'last' } },
    { reviewCount: 'desc' },
  ];

  if (sort === 'name') {
    orderBy = { name: 'asc' };
  } else if (sort === 'year') {
    orderBy = [
      { year: { sort: 'desc', nulls: 'last' } },
      { name: 'asc' },
    ];
  }

  // Get total count for display
  const totalCount = await prisma.fragrance.count({ where });

  // Fetch limited fragrances
  const fragrances = await prisma.fragrance.findMany({
    where,
    include: {
      brand: true,
    },
    orderBy,
    take: limitNum,
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
          <FragrancesPageClient
            initialFragrances={fragrances}
            totalCount={totalCount}
            search={search}
          />
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
