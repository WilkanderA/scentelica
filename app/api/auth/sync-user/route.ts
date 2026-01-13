import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (existingUser) {
      return NextResponse.json({ user: existingUser })
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.name || user.email?.split('@')[0],
        avatarUrl: user.user_metadata.avatar_url,
        role: 'user',
      },
    })

    return NextResponse.json({ user: newUser })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
  }
}
