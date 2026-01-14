import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import FragranceForm from "@/components/admin/FragranceForm";

export const dynamic = 'force-dynamic';

interface EditFragrancePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFragrancePage({ params }: EditFragrancePageProps) {
  const { id } = await params;

  const [fragrance, brands, notes] = await Promise.all([
    prisma.fragrance.findUnique({
      where: { id },
      include: {
        notes: {
          include: {
            note: true,
          },
        },
      },
    }),
    prisma.brand.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.note.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!fragrance) {
    notFound();
  }

  const initialData = {
    id: fragrance.id,
    name: fragrance.name,
    brandId: fragrance.brandId,
    year: fragrance.year,
    gender: fragrance.gender,
    concentration: fragrance.concentration,
    description: fragrance.description,
    bottleImageUrl: fragrance.bottleImageUrl,
    selectedNotes: fragrance.notes.map((fn) => ({
      noteId: fn.noteId,
      noteName: fn.note.name,
      category: fn.category,
      intensity: fn.intensity || undefined,
    })),
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Edit Fragrance</h1>
          <p className="text-gray-600 dark:text-gray-300">Update fragrance information</p>
        </div>
        <Link
          href={`/admin/fragrances/${id}/links`}
          className="px-6 py-3 bg-secondary dark:bg-primary-dm-30 text-white rounded-lg hover:opacity-90 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Manage Product Links
        </Link>
      </div>

      <FragranceForm brands={brands} notes={notes} initialData={initialData} />
    </div>
  );
}
