import { prisma } from "@/lib/db";

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

  const topNotes = notes.filter(n => n.category === 'top');
  const heartNotes = notes.filter(n => n.category === 'heart');
  const baseNotes = notes.filter(n => n.category === 'base');

  const NoteCard = ({ note }: { note: typeof notes[0] }) => (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group">
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
        {note.name}
      </h3>
      {note.description && (
        <p className="text-sm text-gray-600 mb-3">{note.description}</p>
      )}
      <p className="text-xs text-gray-500">
        Used in {note._count.fragrances} {note._count.fragrances === 1 ? 'fragrance' : 'fragrances'}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fragrance Notes
          </h1>
          <p className="text-xl text-gray-600">
            Explore the building blocks of perfumery
          </p>
        </div>

        <div className="space-y-12">
          {topNotes.length > 0 && (
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-accent-mint/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Top Notes</h2>
                  <p className="text-gray-600 text-sm">First impression • 15-30 minutes</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topNotes.map((note: typeof notes[0]) => <NoteCard key={note.id} note={note} />)}
              </div>
            </section>
          )}

          {heartNotes.length > 0 && (
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-accent-lavender/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Heart Notes</h2>
                  <p className="text-gray-600 text-sm">Core character • 2-4 hours</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heartNotes.map((note: typeof notes[0]) => <NoteCard key={note.id} note={note} />)}
              </div>
            </section>
          )}

          {baseNotes.length > 0 && (
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-accent-rose/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Base Notes</h2>
                  <p className="text-gray-600 text-sm">Lasting impression • 4-6+ hours</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {baseNotes.map((note: typeof notes[0]) => <NoteCard key={note.id} note={note} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
