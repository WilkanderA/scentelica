import { Pool } from 'pg'
import { config } from 'dotenv'

config()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const pool = new Pool({
  connectionString: process.env.DATABASE_DIRECT_URL,
  ssl: true
})

async function check() {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM fragrances')
    const count = result.rows[0].count
    console.log(`Fragrances in Supabase: ${count}`)
    
    if (count === '0') {
      console.log('\n⚠️  DATABASE IS EMPTY!')
      console.log('You need to seed the database.')
    } else {
      const fragrances = await pool.query('SELECT f.name, b.name as brand FROM fragrances f JOIN brands b ON f."brandId" = b.id LIMIT 5')
      console.log('\n=== Sample Fragrances ===')
      fragrances.rows.forEach(f => console.log(`- ${f.name} by ${f.brand}`))
    }
  } catch (err: any) {
    console.error('Error:', err.message)
  } finally {
    await pool.end()
  }
}

check()
