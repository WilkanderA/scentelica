import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { fragranceId, content, rating } = body

    // Validate input
    if (!fragranceId || !content || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        rating,
        fragranceId,
        userId: user.id,
      },
    })

    // Update fragrance rating and review count
    const fragrance = await prisma.fragrance.findUnique({
      where: { id: fragranceId },
      include: {
        comments: {
          where: { rating: { not: null } },
          select: { rating: true },
        },
      },
    })

    if (fragrance) {
      const ratings = fragrance.comments
        .map(c => c.rating)
        .filter((r): r is number => r !== null)

      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : null

      await prisma.fragrance.update({
        where: { id: fragranceId },
        data: {
          ratingAvg: avgRating,
          reviewCount: ratings.length,
        },
      })
    }

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
