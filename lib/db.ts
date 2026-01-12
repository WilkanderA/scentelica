import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Pool/Prisma client once and cache globally
if (!globalForPrisma.prisma) {
  // Detect Supabase connection type (check pooler FIRST as it contains both strings)
  const isSupabasePooler = process.env.DATABASE_DIRECT_URL?.includes('pooler.supabase.com')
  const isSupabaseDirectHost = !isSupabasePooler && process.env.DATABASE_DIRECT_URL?.includes('db.') && process.env.DATABASE_DIRECT_URL?.includes('supabase.co')

  console.log('=== Database Connection Initialization ===')
  console.log('DATABASE_DIRECT_URL exists:', !!process.env.DATABASE_DIRECT_URL)
  console.log('Is Supabase direct host:', isSupabaseDirectHost)
  console.log('Is Supabase pooler:', isSupabasePooler)
  console.log('Environment:', process.env.NODE_ENV)

  try {
    console.log('Creating pg Pool with adapter')

    // SSL configuration - needed for both pooler and direct host
    const sslConfig = (isSupabasePooler || isSupabaseDirectHost) ? {
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined as any
    } : undefined

    // Pool configuration - optimized for serverless/pgbouncer
    const pool = new Pool({
      connectionString: process.env.DATABASE_DIRECT_URL,
      ssl: sslConfig,
      // For pgbouncer compatibility
      max: 1,  // Minimize connections in serverless
      idleTimeoutMillis: 0,  // Prevent idle timeout
      connectionTimeoutMillis: 10000  // 10 second connection timeout
    })

    const adapter = new PrismaPg(pool)

    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

    console.log('✓ Database client created successfully')
  } catch (error) {
    console.error('✗ Failed to create database client:', error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma
