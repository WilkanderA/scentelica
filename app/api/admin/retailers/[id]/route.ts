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
    const { name, websiteUrl, logoUrl } = body

    // Validate required fields
    if (!name || !websiteUrl) {
      return NextResponse.json(
        { error: 'Name and website URL are required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(websiteUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid website URL' },
        { status: 400 }
      )
    }

    // Check if another retailer with this name exists (excluding current)
    const existingRetailer = await prisma.retailer.findFirst({
      where: {
        name: name.trim(),
        NOT: { id }
      }
    })

    if (existingRetailer) {
      return NextResponse.json(
        { error: 'A retailer with this name already exists' },
        { status: 400 }
      )
    }

    // Update retailer
    const retailer = await prisma.retailer.update({
      where: { id },
      data: {
        name: name.trim(),
        websiteUrl: websiteUrl.trim(),
        logoUrl: logoUrl?.trim() || null,
      },
    })

    return NextResponse.json(retailer)
  } catch (error) {
    console.error('Error updating retailer:', error)
    return NextResponse.json(
      { error: 'Failed to update retailer' },
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

    // Check if retailer exists
    const retailer = await prisma.retailer.findUnique({
      where: { id },
      include: {
        _count: {
          select: { fragrances: true }
        }
      }
    })

    if (!retailer) {
      return NextResponse.json({ error: 'Retailer not found' }, { status: 404 })
    }

    // Delete retailer (cascade will remove FragranceRetailer relationships)
    await prisma.retailer.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: `Retailer deleted. ${retailer._count.fragrances} product link(s) were removed.`
    })
  } catch (error) {
    console.error('Error deleting retailer:', error)
    return NextResponse.json(
      { error: 'Failed to delete retailer' },
      { status: 500 }
    )
  }
}
