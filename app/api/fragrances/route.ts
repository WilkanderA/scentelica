import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const brand = searchParams.get('brand')
    const gender = searchParams.get('gender')
    const sort = searchParams.get('sort')
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (brand) {
      where.brand = { name: brand }
    }

    if (gender) {
      where.gender = gender
    }

    let orderBy: any = [
      { ratingAvg: { sort: 'desc', nulls: 'last' } },
      { reviewCount: 'desc' },
    ]

    if (sort === 'name') {
      orderBy = { name: 'asc' }
    } else if (sort === 'year') {
      orderBy = [
        { year: { sort: 'desc', nulls: 'last' } },
        { name: 'asc' },
      ]
    }

    const fragrances = await prisma.fragrance.findMany({
      where,
      include: {
        brand: true,
      },
      orderBy,
      skip: offset,
      take: limit,
    })

    return NextResponse.json({ fragrances })
  } catch (error) {
    console.error('Error fetching fragrances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fragrances' },
      { status: 500 }
    )
  }
}
