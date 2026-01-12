import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Pool/Prisma client once and cache globally
if (!globalForPrisma.prisma) {
  // Configure SSL for Supabase connections (note: Supabase uses .co not .com)
  const isSupabase = process.env.DATABASE_DIRECT_URL?.includes('supabase.co')

  console.log('=== Database Connection Initialization ===')
  console.log('DATABASE_DIRECT_URL exists:', !!process.env.DATABASE_DIRECT_URL)
  console.log('Is Supabase detected:', isSupabase)
  console.log('Environment:', process.env.NODE_ENV)

  // For Supabase, configure SSL to accept self-signed certificates
  const sslConfig = isSupabase ? {
    rejectUnauthorized: false,
    // Try multiple approaches to ensure SSL works
    checkServerIdentity: () => undefined as any
  } : undefined

  console.log('SSL Config enabled:', !!sslConfig)

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_DIRECT_URL,
      ssl: sslConfig
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
