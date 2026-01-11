import { notFound } from "next/navigation";
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
    selectedNotes: fragrance.notes.map((fn: { noteId: string; category: string; intensity: number | null }) => ({
      noteId: fn.noteId,
      category: fn.category,
      intensity: fn.intensity || undefined,
    })),
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Fragrance</h1>
        <p className="text-gray-600">Update fragrance information</p>
      </div>

      <FragranceForm brands={brands} notes={notes} initialData={initialData} />
    </div>
  );
}
