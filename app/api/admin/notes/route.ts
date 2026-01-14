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

    // Get request body
    const body = await request.json()
    const { name, category, description, imageUrl } = body

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Validate category
    if (!['top', 'heart', 'base'].includes(category)) {
      return NextResponse.json(
        { error: 'Category must be top, heart, or base' },
        { status: 400 }
      )
    }

    // Check if note with this name already exists
    const existingNote = await prisma.note.findUnique({
      where: { name: name.trim() }
    })

    if (existingNote) {
      return NextResponse.json(
        { error: 'A note with this name already exists' },
        { status: 400 }
      )
    }

    // Create note
    const note = await prisma.note.create({
      data: {
        name: name.trim(),
        category,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
