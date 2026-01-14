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

    // Check if retailer with this name already exists
    const existingRetailer = await prisma.retailer.findUnique({
      where: { name: name.trim() }
    })

    if (existingRetailer) {
      return NextResponse.json(
        { error: 'A retailer with this name already exists' },
        { status: 400 }
      )
    }

    // Create retailer
    const retailer = await prisma.retailer.create({
      data: {
        name: name.trim(),
        websiteUrl: websiteUrl.trim(),
        logoUrl: logoUrl?.trim() || null,
      },
    })

    return NextResponse.json(retailer)
  } catch (error) {
    console.error('Error creating retailer:', error)
    return NextResponse.json(
      { error: 'Failed to create retailer' },
      { status: 500 }
    )
  }
}
