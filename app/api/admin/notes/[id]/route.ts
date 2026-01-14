import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

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

    // Check if another note with this name exists (excluding current note)
    const existingNote = await prisma.note.findFirst({
      where: {
        name: name.trim(),
        NOT: { id }
      }
    })

    if (existingNote) {
      return NextResponse.json(
        { error: 'A note with this name already exists' },
        { status: 400 }
      )
    }

    // Update note
    const note = await prisma.note.update({
      where: { id },
      data: {
        name: name.trim(),
        category,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

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

    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        _count: {
          select: { fragrances: true }
        }
      }
    })

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Delete note (cascade will remove FragranceNote relationships)
    await prisma.note.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: `Note deleted. It was removed from ${note._count.fragrances} fragrance(s).`
    })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}
