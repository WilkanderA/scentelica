import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get the file from the request
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be less than 5MB' }, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${user.id}-${Date.now()}.${fileExtension}`

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
    await mkdir(uploadsDir, { recursive: true })

    // Get current user to check for existing avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { avatarUrl: true }
    })

    // Delete old avatar file if it exists and is a local file
    if (currentUser?.avatarUrl?.startsWith('/uploads/avatars/')) {
      const oldFilePath = path.join(process.cwd(), 'public', currentUser.avatarUrl)
      try {
        await unlink(oldFilePath)
      } catch {
        // Ignore errors if file doesn't exist
      }
    }

    // Convert file to buffer and save
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filePath = path.join(uploadsDir, fileName)

    await writeFile(filePath, buffer)

    // Update user in database
    const publicUrl = `/uploads/avatars/${fileName}`
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: publicUrl }
    })

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get current user avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { avatarUrl: true }
    })

    // Delete avatar file if it's a local file
    if (currentUser?.avatarUrl?.startsWith('/uploads/avatars/')) {
      const filePath = path.join(process.cwd(), 'public', currentUser.avatarUrl)
      try {
        await unlink(filePath)
      } catch {
        // Ignore errors if file doesn't exist
      }
    }

    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: null }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing avatar:', error)
    return NextResponse.json(
      { error: 'Failed to remove avatar' },
      { status: 500 }
    )
  }
}
