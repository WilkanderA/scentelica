import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import FragranceHeader from "@/components/FragranceHeader";
import NotesVisualization from "@/components/NotesVisualization";
import RetailerLinks from "@/components/RetailerLinks";
import CommentSection from "@/components/CommentSection";

interface FragrancePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FragrancePage({ params }: FragrancePageProps) {
  const { id } = await params;

  const fragrance = await prisma.fragrance.findUnique({
    where: { id },
    include: {
      brand: true,
      notes: {
        include: {
          note: true,
        },
        orderBy: {
          category: 'asc',
        },
      },
      retailers: {
        include: {
          retailer: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!fragrance) {
    notFound();
  }

  const notes = fragrance.notes.map((fn) => ({
    id: fn.noteId,
    name: fn.note.name,
    category: fn.category,
    intensity: fn.intensity || undefined,
  }));

  return (
    <div className="min-h-screen">
      <FragranceHeader
        name={fragrance.name}
        brand={fragrance.brand.name}
        year={fragrance.year || undefined}
        gender={fragrance.gender || undefined}
        concentration={fragrance.concentration || undefined}
        ratingAvg={fragrance.ratingAvg || undefined}
        reviewCount={fragrance.reviewCount}
        bottleImageUrl={fragrance.bottleImageUrl || undefined}
        description={fragrance.description || undefined}
      />

      <div className="container mx-auto px-4 py-16 space-y-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <NotesVisualization notes={notes} />
        </div>

        <RetailerLinks retailers={fragrance.retailers} />

        <CommentSection comments={fragrance.comments} />
      </div>
    </div>
  );
}
