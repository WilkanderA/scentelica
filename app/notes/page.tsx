import { prisma } from "@/lib/db";
import { NotesPageClient } from "./NotesPageClient";

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    include: {
      _count: {
        select: { fragrances: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return <NotesPageClient notes={notes} />;
}
