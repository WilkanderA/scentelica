import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function AdminNotesPage() {
  const notes = await prisma.note.findMany({
    include: {
      _count: {
        select: { fragrances: true }
      }
    },
    orderBy: [
      { category: 'asc' },
      { name: 'asc' }
    ]
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'top':
        return 'bg-accent-mint/20 dark:bg-accent-mint/30 text-accent-mint border-accent-mint/30 dark:border-accent-mint/40';
      case 'heart':
        return 'bg-accent-lavender/20 dark:bg-accent-lavender/30 text-accent-lavender border-accent-lavender/30 dark:border-accent-lavender/40';
      case 'base':
        return 'bg-accent-rose/20 dark:bg-accent-rose/30 text-accent-rose border-accent-rose/30 dark:border-accent-rose/40';
      default:
        return 'bg-gray-100 dark:bg-tonal-30 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-tonal-40';
    }
  };

  const categoryLabel = (category: string) => {
    switch (category) {
      case 'top':
        return 'Top';
      case 'heart':
        return 'Heart';
      case 'base':
        return 'Base';
      default:
        return category;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {notes.length} notes in the database
            </p>
          </div>
          <Link
            href="/admin/notes/new"
            className="px-6 py-3 bg-primary dark:bg-primary-dm text-white rounded-lg hover:opacity-90 transition-colors font-medium"
          >
            Add New Note
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/admin/notes/${note.id}/edit`}
              className="bg-white dark:bg-tonal-20 border border-gray-200 dark:border-tonal-40 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-square bg-gray-100 dark:bg-tonal-30">
                {note.imageUrl ? (
                  <Image
                    src={note.imageUrl}
                    alt={note.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {note.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getCategoryColor(note.category)}`}>
                    {categoryLabel(note.category)}
                  </span>
                </div>

                {note.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    {note.description}
                  </p>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Used in {note._count.fragrances} {note._count.fragrances === 1 ? 'fragrance' : 'fragrances'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No notes found. Add your first note to get started.
            </p>
            <Link
              href="/admin/notes/new"
              className="inline-block px-6 py-3 bg-primary dark:bg-primary-dm text-white rounded-lg hover:opacity-90 transition-colors font-medium"
            >
              Add New Note
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
