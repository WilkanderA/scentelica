import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    // Check if user is admin
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

    // Update all fragrances with ratingAvg of 0 to null
    const result = await prisma.$executeRaw`
      UPDATE fragrances
      SET "ratingAvg" = NULL
      WHERE "ratingAvg" = 0 AND "reviewCount" = 0
    `

    return NextResponse.json({
      success: true,
      message: `Updated ${result} fragrances`
    })
  } catch (error) {
    console.error('Error updating ratings:', error)
    return NextResponse.json(
      { error: 'Failed to update ratings' },
      { status: 500 }
    )
  }
}
