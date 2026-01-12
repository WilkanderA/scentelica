import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Search fragrances by name, brand name, or notes
    const fragrances = await prisma.fragrance.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            brand: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            notes: {
              some: {
                note: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
      },
      take: 10,
      orderBy: {
        ratingAvg: 'desc',
      },
    })

    const results = fragrances.map((fragrance) => ({
      id: fragrance.id,
      name: fragrance.name,
      brandName: fragrance.brand.name,
      bottleImageUrl: fragrance.bottleImageUrl,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    )
  }
}
