import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function ManageFragrancesPage() {
  const fragrances = await prisma.fragrance.findMany({
    include: {
      brand: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Manage Fragrances</h1>
          <p className="text-gray-600 dark:text-gray-300">{fragrances.length} total fragrances</p>
        </div>
        <Link
          href="/admin/fragrances/new"
          className="px-6 py-3 bg-primary dark:bg-primary-dm text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium"
        >
          Add New Fragrance
        </Link>
      </div>

      <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-tonal-30 border-b border-gray-200 dark:border-tonal-40">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Brand</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Year</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Gender</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Rating</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-tonal-40">
            {fragrances.map((fragrance: { id: string; name: string; brand: { name: string }; year: number | null; gender: string | null; ratingAvg: number | null }) => (
              <tr key={fragrance.id} className="hover:bg-gray-50 dark:hover:bg-tonal-30">
                <td className="px-6 py-4">
                  <Link
                    href={`/fragrances/${fragrance.id}`}
                    className="text-gray-900 dark:text-white font-medium hover:text-primary dark:hover:text-primary-dm"
                  >
                    {fragrance.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{fragrance.brand.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{fragrance.year || '-'}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{fragrance.gender || '-'}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {fragrance.ratingAvg ? fragrance.ratingAvg.toFixed(1) : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/fragrances/${fragrance.id}/edit`}
                    className="text-primary dark:text-primary-dm hover:opacity-80 font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
