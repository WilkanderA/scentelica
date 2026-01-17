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

    const body = await request.json()
    const { action } = body

    if (action === 'clear-images') {
      // Clear all bottle images
      const result = await prisma.fragrance.updateMany({
        where: {
          bottleImageUrl: { not: null }
        },
        data: {
          bottleImageUrl: null
        }
      })

      return NextResponse.json({
        success: true,
        message: `Cleared images from ${result.count} fragrances`
      })
    }

    if (action === 'update-images') {
      const { updates } = body as {
        updates: Array<{ name: string; brand: string; imageUrl: string }>
      }

      if (!Array.isArray(updates)) {
        return NextResponse.json({ error: 'Updates must be an array' }, { status: 400 })
      }

      let updated = 0
      let failed = 0
      const errors: string[] = []

      // Process in batches for efficiency
      for (const update of updates) {
        try {
          // Find the fragrance by name and brand
          const fragrance = await prisma.fragrance.findFirst({
            where: {
              name: update.name,
              brand: {
                name: update.brand
              }
            }
          })

          if (!fragrance) {
            failed++
            errors.push(`Not found: ${update.name} by ${update.brand}`)
            continue
          }

          await prisma.fragrance.update({
            where: { id: fragrance.id },
            data: { bottleImageUrl: update.imageUrl }
          })

          updated++
        } catch (err) {
          failed++
          errors.push(`Error updating ${update.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }

      return NextResponse.json({ updated, failed, errors })
    }

    if (action === 'fix-image-urls') {
      // Clear Fragrantica placeholder images - we can't use these
      // This clears both full URLs and filename-only entries
      const result = await prisma.$executeRaw`
        UPDATE "fragrances"
        SET "bottleImageUrl" = NULL
        WHERE "bottleImageUrl" IS NOT NULL
        AND (
          "bottleImageUrl" LIKE '%fimgs.net%'
          OR "bottleImageUrl" LIKE 'o.%.jpg'
        )
      `

      return NextResponse.json({
        success: true,
        message: `Cleared ${result} Fragrantica placeholder images`
      })
    }

    if (action === 'update-images-from-json') {
      // Update existing fragrances with images from perfume database JSON format
      const { data } = body as {
        data: Array<{ perfume: string; brand: string; image?: string }>
      }

      if (!Array.isArray(data)) {
        return NextResponse.json({ error: 'Data must be an array' }, { status: 400 })
      }

      let updated = 0
      let skipped = 0
      let notFound = 0

      // Process in batches
      for (const entry of data) {
        if (!entry.image) {
          skipped++
          continue
        }

        try {
          // Find the fragrance by name and brand
          const fragrance = await prisma.fragrance.findFirst({
            where: {
              name: entry.perfume,
              brand: {
                name: entry.brand
              },
              bottleImageUrl: null // Only update if no image yet
            }
          })

          if (!fragrance) {
            notFound++
            continue
          }

          await prisma.fragrance.update({
            where: { id: fragrance.id },
            data: { bottleImageUrl: entry.image }
          })

          updated++
        } catch {
          // Skip errors silently for bulk operation
        }
      }

      return NextResponse.json({
        success: true,
        message: `Updated ${updated} fragrances with images. Skipped ${skipped} (no image). Not found/already has image: ${notFound}.`
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Bulk operation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Operation failed' },
      { status: 500 }
    )
  }
}
