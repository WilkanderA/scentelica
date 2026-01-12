import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Pool/Prisma client once and cache globally
if (!globalForPrisma.prisma) {
  // Configure SSL for Supabase connections
  const isSupabase = process.env.DATABASE_DIRECT_URL?.includes('supabase.com')

  // For Supabase, configure SSL to accept self-signed certificates
  const sslConfig = isSupabase ? {
    rejectUnauthorized: false,
    // Try multiple approaches to ensure SSL works
    checkServerIdentity: () => undefined as any
  } : undefined

  const pool = new Pool({
    connectionString: process.env.DATABASE_DIRECT_URL,
    ssl: sslConfig
  })
  const adapter = new PrismaPg(pool)

  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma
