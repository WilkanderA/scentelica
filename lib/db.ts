import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Configure SSL for Supabase connections
const isSupabase = process.env.DATABASE_DIRECT_URL?.includes('supabase.com')
const pool = new Pool({
  connectionString: process.env.DATABASE_DIRECT_URL,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined
})
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Cache Prisma client in all environments to avoid connection exhaustion
if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma
