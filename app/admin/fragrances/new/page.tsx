import { prisma } from "@/lib/db";
import FragranceForm from "@/components/admin/FragranceForm";

export const dynamic = 'force-dynamic';

export default async function NewFragrancePage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });

  const notes = await prisma.note.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Fragrance</h1>
        <p className="text-gray-600">Create a new fragrance entry in the database</p>
      </div>

      <FragranceForm brands={brands} notes={notes} />
    </div>
  );
}
