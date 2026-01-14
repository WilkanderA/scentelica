import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductLinksManager } from "@/components/admin/ProductLinksManager";

export const dynamic = 'force-dynamic';

interface ProductLinksPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductLinksPage({ params }: ProductLinksPageProps) {
  const { id } = await params;

  const fragrance = await prisma.fragrance.findUnique({
    where: { id },
    include: {
      brand: true,
      retailers: {
        include: {
          retailer: true,
        },
      },
    },
  });

  if (!fragrance) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/admin/fragrances/${id}/edit`}
          className="inline-flex items-center text-primary dark:text-primary-dm hover:opacity-80 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Edit Fragrance
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Product Links
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {fragrance.name} by {fragrance.brand.name}
          </p>
        </div>

        <ProductLinksManager fragranceId={fragrance.id} existingLinks={fragrance.retailers} />
      </div>
    </div>
  );
}
