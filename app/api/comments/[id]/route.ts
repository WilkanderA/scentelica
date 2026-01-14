import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user from database to check role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (dbUser?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get the comment to find its fragrance ID
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { fragranceId: true, rating: true }
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id }
    })

    // Recalculate fragrance rating if the deleted comment had a rating
    if (comment.rating !== null) {
      const fragrance = await prisma.fragrance.findUnique({
        where: { id: comment.fragranceId },
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
          where: { id: comment.fragranceId },
          data: {
            ratingAvg: avgRating,
            reviewCount: ratings.length,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
