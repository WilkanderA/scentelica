import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

export async function generateMetadata({ params }: FragrancePageProps): Promise<Metadata> {
  const { id } = await params;

  const fragrance = await prisma.fragrance.findUnique({
    where: { id },
    include: {
      brand: true,
    },
  });

  if (!fragrance) {
    return {
      title: "Fragrance Not Found",
    };
  }

  const title = `${fragrance.name} by ${fragrance.brand.name}`;
  const description = fragrance.description ||
    `Discover ${fragrance.name} by ${fragrance.brand.name}. ${fragrance.gender || 'Unisex'} fragrance${fragrance.concentration ? ` - ${fragrance.concentration}` : ''}. View notes, reviews, and where to buy.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: fragrance.bottleImageUrl ? [{ url: fragrance.bottleImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: fragrance.bottleImageUrl ? [fragrance.bottleImageUrl] : [],
    },
  };
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

  const notes = fragrance.notes.map((fn: { noteId: string; note: { name: string }; category: string; intensity: number | null }) => ({
    id: fn.noteId,
    name: fn.note.name,
    category: fn.category,
    intensity: fn.intensity || undefined,
  }));

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: fragrance.name,
    brand: {
      "@type": "Brand",
      name: fragrance.brand.name,
    },
    description: fragrance.description || `${fragrance.name} by ${fragrance.brand.name}`,
    image: fragrance.bottleImageUrl,
    ...(fragrance.ratingAvg && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: fragrance.ratingAvg,
        reviewCount: fragrance.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(fragrance.retailers.length > 0 && {
      offers: fragrance.retailers.map((fr: { productUrl: string; currency: string | null; price: number | null; retailer: { name: string } }) => ({
        "@type": "Offer",
        url: fr.productUrl,
        priceCurrency: fr.currency || "USD",
        price: fr.price,
        seller: {
          "@type": "Organization",
          name: fr.retailer.name,
        },
      })),
    }),
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
