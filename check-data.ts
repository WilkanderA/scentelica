import { prisma } from './lib/db'

async function check() {
  try {
    const fragranceCount = await prisma.fragrance.count()
    const brandCount = await prisma.brand.count()
    const noteCount = await prisma.note.count()
    
    console.log('=== Database Contents ===')
    console.log(`Brands: ${brandCount}`)
    console.log(`Notes: ${noteCount}`)
    console.log(`Fragrances: ${fragranceCount}`)
    
    if (fragranceCount > 0) {
      console.log('\n=== Sample Fragrances ===')
      const fragrances = await prisma.fragrance.findMany({
        include: { brand: true },
        take: 5
      })
      fragrances.forEach(f => {
        console.log(`- ${f.name} by ${f.brand.name}`)
      })
    } else {
      console.log('\n⚠️  DATABASE IS EMPTY - Need to run seed script!')
    }
  } catch (err: any) {
    console.error('Error:', err.message)
  } finally {
    await prisma.$disconnect()
  }
}

check()
