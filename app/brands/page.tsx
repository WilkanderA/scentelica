import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: { fragrances: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fragrance Brands
          </h1>
          <p className="text-xl text-gray-600">
            Explore fragrances from the world's finest perfume houses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/fragrances?brand=${encodeURIComponent(brand.name)}`}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {brand.name}
                </h2>
                {brand.country && (
                  <p className="text-sm text-gray-500">{brand.country}</p>
                )}
                {brand.description && (
                  <p className="text-gray-600 line-clamp-2">{brand.description}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {brand._count.fragrances} {brand._count.fragrances === 1 ? 'fragrance' : 'fragrances'}
                  </span>
                  <svg className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
