import { Pool } from 'pg'
import { config } from 'dotenv'

config()

console.log('=== Testing Database Connection ===')
console.log('DATABASE_DIRECT_URL:', process.env.DATABASE_DIRECT_URL?.substring(0, 80) + '...')

const isSupabasePooler = process.env.DATABASE_DIRECT_URL?.includes('pooler.supabase.com')
const isSupabaseDirectHost = !isSupabasePooler && process.env.DATABASE_DIRECT_URL?.includes('db.') && process.env.DATABASE_DIRECT_URL?.includes('supabase.co')
console.log('Is Supabase direct host:', isSupabaseDirectHost)
console.log('Is Supabase pooler:', isSupabasePooler)

const sslConfig = (isSupabaseDirectHost || isSupabasePooler) ? {
  rejectUnauthorized: false,
  checkServerIdentity: () => undefined as any
} : undefined

console.log('SSL Config:', sslConfig)

const pool = new Pool({
  connectionString: process.env.DATABASE_DIRECT_URL,
  ssl: sslConfig
})

async function test() {
  try {
    console.log('\n=== Testing Connection ===')
    const result = await pool.query('SELECT NOW() as time, version() as version')
    console.log('✓ Connection successful!')
    console.log('Server time:', result.rows[0].time)
    console.log('PostgreSQL version:', result.rows[0].version.substring(0, 50) + '...')
    
    console.log('\n=== Checking Tables ===')
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    console.log('Tables found:', tables.rows.map(r => r.table_name).join(', '))
    
    console.log('\n=== Checking Data ===')
    const counts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM brands) as brands,
        (SELECT COUNT(*) FROM notes) as notes,
        (SELECT COUNT(*) FROM fragrances) as fragrances
    `)
    console.log('Data counts:', counts.rows[0])
    
    if (counts.rows[0].fragrances > 0) {
      const samples = await pool.query(`
        SELECT f.name, b.name as brand 
        FROM fragrances f 
        JOIN brands b ON f."brandId" = b.id 
        LIMIT 3
      `)
      console.log('\n=== Sample Fragrances ===')
      samples.rows.forEach(r => console.log(`- ${r.name} by ${r.brand}`))
    }
    
  } catch (err: any) {
    console.error('\n✗ Connection failed!')
    console.error('Error:', err.message)
    console.error('Code:', err.code)
  } finally {
    await pool.end()
  }
}

test()
