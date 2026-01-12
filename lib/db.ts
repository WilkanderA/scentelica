import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Pool/Prisma client once and cache globally
if (!globalForPrisma.prisma) {
  // Configure SSL for Supabase connections - disable certificate verification
  const isSupabase = process.env.DATABASE_DIRECT_URL?.includes('supabase.com')

  if (isSupabase) {
    // For Supabase, we need to disable TLS rejection
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_DIRECT_URL,
    ssl: isSupabase ? true : undefined
  })
  const adapter = new PrismaPg(pool)

  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma
