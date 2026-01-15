import { prisma } from "@/lib/db";
import { AdminNotesPageClient } from "./AdminNotesPageClient";

export const dynamic = 'force-dynamic';

export default async function AdminNotesPage() {
  const notes = await prisma.note.findMany({
    include: {
      _count: {
        select: { fragrances: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return <AdminNotesPageClient notes={notes} />;
}
