import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import FragranceCard from "@/components/FragranceCard";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;

  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) {
    return {
      title: "Note Not Found",
    };
  }

  return {
    title: `${note.name} - Fragrances`,
    description: note.description || `Discover fragrances featuring ${note.name}`,
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      fragrances: {
        include: {
          fragrance: {
            include: {
              brand: true,
            },
          },
        },
      },
    },
  });

  if (!note) {
    notFound();
  }

  const fragrances = note.fragrances.map((fn) => fn.fragrance);

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'top':
        return 'bg-accent-mint/20 dark:bg-accent-mint/30 border-accent-mint/30 dark:border-accent-mint/40';
      case 'heart':
        return 'bg-accent-lavender/20 dark:bg-accent-lavender/30 border-accent-lavender/30 dark:border-accent-lavender/40';
      case 'base':
        return 'bg-accent-rose/20 dark:bg-accent-rose/30 border-accent-rose/30 dark:border-accent-rose/40';
      default:
        return 'bg-gray-100 dark:bg-tonal-30 border-gray-200 dark:border-tonal-40';
    }
  };

  const categoryLabel = (category: string) => {
    switch (category) {
      case 'top':
        return 'Top Note';
      case 'heart':
        return 'Heart Note';
      case 'base':
        return 'Base Note';
      default:
        return 'Note';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          href="/notes"
          className="inline-flex items-center text-primary dark:text-primary-dm hover:opacity-80 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Notes
        </Link>

        {/* Note header */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {note.imageUrl && (
              <div className="relative aspect-square bg-gray-100 dark:bg-tonal-30 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={note.imageUrl}
                  alt={note.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className={note.imageUrl ? "md:col-span-2 flex flex-col justify-center" : "md:col-span-3"}>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  {note.name}
                </h1>
                {note.category && (
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getCategoryColor(note.category)}`}>
                    {categoryLabel(note.category)}
                  </span>
                )}
              </div>
              {note.description && (
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {note.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fragrances section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Fragrances with {note.name} ({fragrances.length})
          </h2>

          {fragrances.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No fragrances found with this note yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fragrances.map((fragrance) => (
                <FragranceCard
                  key={fragrance.id}
                  id={fragrance.id}
                  name={fragrance.name}
                  brand={fragrance.brand.name}
                  gender={fragrance.gender || undefined}
                  concentration={fragrance.concentration || undefined}
                  ratingAvg={fragrance.ratingAvg || undefined}
                  reviewCount={fragrance.reviewCount}
                  bottleImageUrl={fragrance.bottleImageUrl || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
