import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    // Check if user is admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user from database to check role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (dbUser?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Run migration
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "comment_helpful" (
        "id" TEXT NOT NULL,
        "commentId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "comment_helpful_pkey" PRIMARY KEY ("id")
      )
    `

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "comment_helpful_commentId_idx" ON "comment_helpful"("commentId")
    `

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "comment_helpful_userId_idx" ON "comment_helpful"("userId")
    `

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "comment_helpful_commentId_userId_key" ON "comment_helpful"("commentId", "userId")
    `

    // Add foreign keys
    await prisma.$executeRaw`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'comment_helpful_commentId_fkey'
        ) THEN
          ALTER TABLE "comment_helpful" ADD CONSTRAINT "comment_helpful_commentId_fkey"
          FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$
    `

    await prisma.$executeRaw`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'comment_helpful_userId_fkey'
        ) THEN
          ALTER TABLE "comment_helpful" ADD CONSTRAINT "comment_helpful_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$
    `

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully'
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Failed to run migration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
