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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Fragrances</h1>
          <p className="text-gray-600">{fragrances.length} total fragrances</p>
        </div>
        <Link
          href="/admin/fragrances/new"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Add New Fragrance
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Brand</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Year</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Gender</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Rating</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fragrances.map((fragrance: { id: string; name: string; brand: { name: string }; year: number | null; gender: string | null; ratingAvg: number | null }) => (
              <tr key={fragrance.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/fragrances/${fragrance.id}`}
                    className="text-gray-900 font-medium hover:text-primary"
                  >
                    {fragrance.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600">{fragrance.brand.name}</td>
                <td className="px-6 py-4 text-gray-600">{fragrance.year || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{fragrance.gender || '-'}</td>
                <td className="px-6 py-4 text-gray-600">
                  {fragrance.ratingAvg ? fragrance.ratingAvg.toFixed(1) : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/fragrances/${fragrance.id}/edit`}
                    className="text-primary hover:text-primary-dark font-medium"
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
