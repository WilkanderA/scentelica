import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get user from database to check role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (dbUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Find fragrances with reviewCount = 0 but ratingAvg not null
    const fragrancesToFix = await prisma.fragrance.findMany({
      where: {
        reviewCount: 0,
        ratingAvg: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        ratingAvg: true
      }
    })

    if (fragrancesToFix.length > 0) {
      // Fix them
      await prisma.fragrance.updateMany({
        where: {
          reviewCount: 0,
          ratingAvg: {
            not: null
          }
        },
        data: {
          ratingAvg: null
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fragrancesToFix.length} fragrance(s)`,
      fragrances: fragrancesToFix.map(f => ({
        name: f.name,
        oldRating: f.ratingAvg
      }))
    })
  } catch (error) {
    console.error('Error fixing zero ratings:', error)
    return NextResponse.json(
      { error: 'Failed to fix zero ratings' },
      { status: 500 }
    )
  }
}
