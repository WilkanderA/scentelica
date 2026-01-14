import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

type RouteParams = {
  params: Promise<{
    id: string
    linkId: string
  }>
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { linkId } = await params

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

    // Delete the link
    await prisma.fragranceRetailer.delete({
      where: { id: linkId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product link:', error)
    return NextResponse.json(
      { error: 'Failed to delete product link' },
      { status: 500 }
    )
  }
}
