import Link from "next/link";
import FragranceCard from "@/components/FragranceCard";
import { SearchBar } from "@/components/SearchBar";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let fragrances;

  try {
    console.log('=== Fetching fragrances from database ===')
    fragrances = await prisma.fragrance.findMany({
      include: {
        brand: true,
      },
      orderBy: {
        ratingAvg: 'desc',
      },
      take: 6,
    });
    console.log('✓ Successfully fetched', fragrances.length, 'fragrances')
  } catch (error: any) {
    console.error('✗ Database query failed:', error)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Error stack:', error.stack)

    // Return error UI instead of hanging
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Database Error</h2>
          <p className="text-red-700 mb-2">Failed to load fragrances from the database.</p>
          <pre className="text-sm bg-red-100 p-4 rounded overflow-auto">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/5 via-accent-lavender/10 to-accent-rose/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Signature Scent
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the world's finest fragrances. Read authentic reviews, discover notes, and find where to buy.
            </p>
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Top Rated Fragrances
              </h2>
              <p className="text-gray-600">
                Discover the most loved scents by our community
              </p>
            </div>
            <Link
              href="/fragrances"
              className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all rounded-lg font-medium"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fragrances.map((fragrance: { id: string; name: string; brand: { name: string }; gender: string | null; concentration: string | null; ratingAvg: number | null; reviewCount: number; bottleImageUrl: string | null }) => (
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
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose Scentelica?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Easy Discovery</h3>
                <p className="text-gray-600">
                  Find your perfect fragrance with our intuitive search and filtering
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Community Reviews</h3>
                <p className="text-gray-600">
                  Read authentic reviews from real fragrance enthusiasts
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Modern Experience</h3>
                <p className="text-gray-600">
                  Clean, fast, and beautiful interface built for today's users
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
