import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function AdminRetailersPage() {
  const retailers = await prisma.retailer.findMany({
    include: {
      _count: {
        select: { fragrances: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Retailers
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {retailers.length} retailers in the database
            </p>
          </div>
          <Link
            href="/admin/retailers/new"
            className="px-6 py-3 bg-primary dark:bg-primary-dm text-white rounded-lg hover:opacity-90 transition-colors font-medium"
          >
            Add New Retailer
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {retailers.map((retailer) => (
            <Link
              key={retailer.id}
              href={`/admin/retailers/${retailer.id}/edit`}
              className="bg-white dark:bg-tonal-20 border border-gray-200 dark:border-tonal-40 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {retailer.name}
                  </h3>
                  <a
                    href={retailer.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary dark:text-primary-dm hover:underline break-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {retailer.websiteUrl}
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    Used in {retailer._count.fragrances} {retailer._count.fragrances === 1 ? 'fragrance' : 'fragrances'}
                  </p>
                </div>
                {retailer.logoUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={retailer.logoUrl}
                      alt={retailer.name}
                      className="w-16 h-16 object-contain rounded"
                    />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {retailers.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No retailers found. Add your first retailer to get started.
            </p>
            <Link
              href="/admin/retailers/new"
              className="inline-block px-6 py-3 bg-primary dark:bg-primary-dm text-white rounded-lg hover:opacity-90 transition-colors font-medium"
            >
              Add New Retailer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
