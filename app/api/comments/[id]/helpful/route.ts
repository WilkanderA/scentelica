import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function POST(request: Request, { params }: RouteParams) {
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

    // Check if user is trying to mark their own comment as helpful
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (existingComment?.userId === user.id) {
      return NextResponse.json(
        { error: 'You cannot mark your own comment as helpful' },
        { status: 400 }
      )
    }

    // Check if user already marked this comment as helpful
    const existingVote = await prisma.commentHelpful.findUnique({
      where: {
        commentId_userId: {
          commentId: id,
          userId: user.id
        }
      }
    })

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already marked this comment as helpful' },
        { status: 400 }
      )
    }

    // Create helpful vote and increment count
    const updatedComment = await prisma.$transaction(async (tx) => {
      await tx.commentHelpful.create({
        data: {
          commentId: id,
          userId: user.id
        }
      })

      return await tx.comment.update({
        where: { id },
        data: {
          helpfulCount: {
            increment: 1
          }
        },
        select: {
          helpfulCount: true
        }
      })
    })

    return NextResponse.json({
      success: true,
      helpfulCount: updatedComment.helpfulCount
    })
  } catch (error) {
    console.error('Error updating helpful count:', error)
    return NextResponse.json(
      { error: 'Failed to update helpful count' },
      { status: 500 }
    )
  }
}
