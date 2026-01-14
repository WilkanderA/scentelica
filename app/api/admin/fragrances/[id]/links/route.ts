import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

// Extract retailer name and website from URL
function extractRetailerInfo(url: string) {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname
    const parts = hostname.split('.')

    // Remove 'www' and get the main domain name
    const mainPart = parts.find(p => p !== 'www' && p !== 'com' && p !== 'co' && p !== 'net') || parts[0]

    // Capitalize first letter
    const name = mainPart.charAt(0).toUpperCase() + mainPart.slice(1)

    // Website URL is the origin
    const websiteUrl = urlObj.origin

    return { name, websiteUrl }
  } catch {
    return { name: 'Unknown Retailer', websiteUrl: url }
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: fragranceId } = await params

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
    const { url, price, currency } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Extract retailer info
    const { name, websiteUrl } = extractRetailerInfo(url)

    // Find or create retailer
    let retailer = await prisma.retailer.findFirst({
      where: { name }
    })

    if (!retailer) {
      retailer = await prisma.retailer.create({
        data: {
          name,
          websiteUrl,
        }
      })
    }

    // Create fragrance-retailer link
    const link = await prisma.fragranceRetailer.create({
      data: {
        fragranceId,
        retailerId: retailer.id,
        productUrl: url.trim(),
        price: price || null,
        currency: currency || null,
      },
      include: {
        retailer: true,
      }
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error adding product link:', error)
    return NextResponse.json(
      { error: 'Failed to add product link' },
      { status: 500 }
    )
  }
}
