import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

interface ImportNote {
  top?: string[]
  heart?: string[]
  base?: string[]
}

interface ImportFragrance {
  name: string
  brand: string
  year?: number
  gender?: string
  concentration?: string
  description?: string
  bottleImageUrl?: string
  notes?: ImportNote
}

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

    // Get request body
    const body = await request.json()
    const { fragrances } = body as { fragrances: ImportFragrance[] }

    if (!Array.isArray(fragrances)) {
      return NextResponse.json({ error: 'Fragrances must be an array' }, { status: 400 })
    }

    let successCount = 0
    let failedCount = 0
    const errors: string[] = []

    // Process each fragrance
    for (let i = 0; i < fragrances.length; i++) {
      const fragData = fragrances[i]

      try {
        // Validate required fields
        if (!fragData.name || !fragData.brand) {
          throw new Error(`Fragrance at index ${i}: name and brand are required`)
        }

        // Find or create brand
        let brand = await prisma.brand.findFirst({
          where: { name: fragData.brand.trim() }
        })

        if (!brand) {
          brand = await prisma.brand.create({
            data: { name: fragData.brand.trim() }
          })
        }

        // Create fragrance
        const fragrance = await prisma.fragrance.create({
          data: {
            name: fragData.name.trim(),
            brandId: brand.id,
            year: fragData.year || null,
            gender: fragData.gender || null,
            concentration: fragData.concentration || null,
            description: fragData.description || null,
            bottleImageUrl: fragData.bottleImageUrl || null,
          }
        })

        // Process notes if provided
        if (fragData.notes) {
          const notesToCreate: Array<{ noteId: string; category: string; intensity: number }> = []

          // Process top notes
          if (fragData.notes.top && Array.isArray(fragData.notes.top)) {
            for (const noteName of fragData.notes.top) {
              const note = await prisma.note.upsert({
                where: { name: noteName.trim() },
                update: {},
                create: {
                  name: noteName.trim(),
                  category: 'top',
                },
              })
              notesToCreate.push({
                noteId: note.id,
                category: 'top',
                intensity: 3,
              })
            }
          }

          // Process heart notes
          if (fragData.notes.heart && Array.isArray(fragData.notes.heart)) {
            for (const noteName of fragData.notes.heart) {
              const note = await prisma.note.upsert({
                where: { name: noteName.trim() },
                update: {},
                create: {
                  name: noteName.trim(),
                  category: 'heart',
                },
              })
              notesToCreate.push({
                noteId: note.id,
                category: 'heart',
                intensity: 3,
              })
            }
          }

          // Process base notes
          if (fragData.notes.base && Array.isArray(fragData.notes.base)) {
            for (const noteName of fragData.notes.base) {
              const note = await prisma.note.upsert({
                where: { name: noteName.trim() },
                update: {},
                create: {
                  name: noteName.trim(),
                  category: 'base',
                },
              })
              notesToCreate.push({
                noteId: note.id,
                category: 'base',
                intensity: 3,
              })
            }
          }

          // Link notes to fragrance
          if (notesToCreate.length > 0) {
            await prisma.fragranceNote.createMany({
              data: notesToCreate.map(note => ({
                fragranceId: fragrance.id,
                noteId: note.noteId,
                category: note.category,
                intensity: note.intensity,
              })),
              skipDuplicates: true,
            })
          }
        }

        successCount++
      } catch (error) {
        failedCount++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`${fragData.name || `Fragrance at index ${i}`}: ${errorMessage}`)
      }
    }

    return NextResponse.json({
      success: successCount,
      failed: failedCount,
      errors,
    })
  } catch (error) {
    console.error('Error processing bulk import:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process import' },
      { status: 500 }
    )
  }
}
