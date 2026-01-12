import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { config } from 'dotenv'

config()

// Use TCP connection for seeding with SSL for Supabase
const isSupabase = process.env.DATABASE_DIRECT_URL?.includes('supabase.com')
const pool = new Pool({
  connectionString: process.env.DATABASE_DIRECT_URL,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined
})
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create Brands
  const chanel = await prisma.brand.upsert({
    where: { name: 'Chanel' },
    update: {},
    create: {
      name: 'Chanel',
      description: 'French luxury fashion house founded by Coco Chanel',
      country: 'France',
    },
  })

  const dior = await prisma.brand.upsert({
    where: { name: 'Dior' },
    update: {},
    create: {
      name: 'Dior',
      description: 'French luxury goods company controlled by LVMH',
      country: 'France',
    },
  })

  const tomFord = await prisma.brand.upsert({
    where: { name: 'Tom Ford' },
    update: {},
    create: {
      name: 'Tom Ford',
      description: 'American luxury brand known for sophisticated fragrances',
      country: 'USA',
    },
  })

  const ysl = await prisma.brand.upsert({
    where: { name: 'Yves Saint Laurent' },
    update: {},
    create: {
      name: 'Yves Saint Laurent',
      description: 'French luxury fashion house founded by Yves Saint Laurent',
      country: 'France',
    },
  })

  const creed = await prisma.brand.upsert({
    where: { name: 'Creed' },
    update: {},
    create: {
      name: 'Creed',
      description: 'Anglo-French luxury perfume house',
      country: 'France',
    },
  })

  console.log('Brands created')

  // Create Notes
  const bergamot = await prisma.note.upsert({
    where: { name: 'Bergamot' },
    update: {},
    create: {
      name: 'Bergamot',
      category: 'top',
      description: 'Citrusy and fresh, with a slightly bitter edge',
    },
  })

  const lemon = await prisma.note.upsert({
    where: { name: 'Lemon' },
    update: {},
    create: {
      name: 'Lemon',
      category: 'top',
      description: 'Bright, zesty, and energizing citrus note',
    },
  })

  const lavender = await prisma.note.upsert({
    where: { name: 'Lavender' },
    update: {},
    create: {
      name: 'Lavender',
      category: 'top',
      description: 'Fresh, herbaceous, and aromatic floral note',
    },
  })

  const rose = await prisma.note.upsert({
    where: { name: 'Rose' },
    update: {},
    create: {
      name: 'Rose',
      category: 'heart',
      description: 'Classic floral note, romantic and elegant',
    },
  })

  const jasmine = await prisma.note.upsert({
    where: { name: 'Jasmine' },
    update: {},
    create: {
      name: 'Jasmine',
      category: 'heart',
      description: 'Rich, sweet, and intoxicating floral note',
    },
  })

  const iris = await prisma.note.upsert({
    where: { name: 'Iris' },
    update: {},
    create: {
      name: 'Iris',
      category: 'heart',
      description: 'Powdery, elegant, and sophisticated floral note',
    },
  })

  const patchouli = await prisma.note.upsert({
    where: { name: 'Patchouli' },
    update: {},
    create: {
      name: 'Patchouli',
      category: 'base',
      description: 'Earthy, woody, and slightly sweet',
    },
  })

  const vanilla = await prisma.note.upsert({
    where: { name: 'Vanilla' },
    update: {},
    create: {
      name: 'Vanilla',
      category: 'base',
      description: 'Sweet, creamy, and comforting',
    },
  })

  const sandalwood = await prisma.note.upsert({
    where: { name: 'Sandalwood' },
    update: {},
    create: {
      name: 'Sandalwood',
      category: 'base',
      description: 'Creamy, soft, and woody',
    },
  })

  const musk = await prisma.note.upsert({
    where: { name: 'Musk' },
    update: {},
    create: {
      name: 'Musk',
      category: 'base',
      description: 'Soft, powdery, and skin-like',
    },
  })

  const amber = await prisma.note.upsert({
    where: { name: 'Amber' },
    update: {},
    create: {
      name: 'Amber',
      category: 'base',
      description: 'Warm, resinous, and sweet',
    },
  })

  const cedarwood = await prisma.note.upsert({
    where: { name: 'Cedarwood' },
    update: {},
    create: {
      name: 'Cedarwood',
      category: 'base',
      description: 'Dry, woody, and slightly sweet',
    },
  })

  const vetiver = await prisma.note.upsert({
    where: { name: 'Vetiver' },
    update: {},
    create: {
      name: 'Vetiver',
      category: 'base',
      description: 'Earthy, woody, and smoky',
    },
  })

  const tonkaBean = await prisma.note.upsert({
    where: { name: 'Tonka Bean' },
    update: {},
    create: {
      name: 'Tonka Bean',
      category: 'base',
      description: 'Sweet, warm, and slightly spicy',
    },
  })

  const blackPepper = await prisma.note.upsert({
    where: { name: 'Black Pepper' },
    update: {},
    create: {
      name: 'Black Pepper',
      category: 'top',
      description: 'Spicy, sharp, and energizing',
    },
  })

  const pinkPepper = await prisma.note.upsert({
    where: { name: 'Pink Pepper' },
    update: {},
    create: {
      name: 'Pink Pepper',
      category: 'top',
      description: 'Spicy, fresh, and slightly fruity',
    },
  })

  const oud = await prisma.note.upsert({
    where: { name: 'Oud' },
    update: {},
    create: {
      name: 'Oud',
      category: 'base',
      description: 'Rich, woody, and complex oriental note',
    },
  })

  const incense = await prisma.note.upsert({
    where: { name: 'Incense' },
    update: {},
    create: {
      name: 'Incense',
      category: 'heart',
      description: 'Smoky, resinous, and mystical',
    },
  })

  console.log('Notes created')

  // Create Fragrances
  const bleuDeChanel = await prisma.fragrance.create({
    data: {
      name: 'Bleu de Chanel',
      brandId: chanel.id,
      year: 2010,
      gender: 'Men',
      concentration: 'EDP',
      description:
        'An aromatic-woody fragrance that embodies freedom with its fresh citrus and sensual woody notes. A timeless scent that celebrates the spirit of a man who chooses his own destiny.',
      ratingAvg: 4.5,
      reviewCount: 0,
    },
  })

  await prisma.fragranceNote.createMany({
    data: [
      { fragranceId: bleuDeChanel.id, noteId: lemon.id, category: 'top', intensity: 4 },
      { fragranceId: bleuDeChanel.id, noteId: bergamot.id, category: 'top', intensity: 3 },
      { fragranceId: bleuDeChanel.id, noteId: pinkPepper.id, category: 'top', intensity: 3 },
      { fragranceId: bleuDeChanel.id, noteId: incense.id, category: 'heart', intensity: 4 },
      { fragranceId: bleuDeChanel.id, noteId: cedarwood.id, category: 'base', intensity: 5 },
      { fragranceId: bleuDeChanel.id, noteId: sandalwood.id, category: 'base', intensity: 3 },
    ],
  })

  const chanelNo5 = await prisma.fragrance.create({
    data: {
      name: 'Chanel No 5',
      brandId: chanel.id,
      year: 1921,
      gender: 'Women',
      concentration: 'Parfum',
      description:
        'The epitome of timeless elegance. An iconic floral-aldehyde fragrance that revolutionized perfumery. The essence of femininity captured in a bottle.',
      ratingAvg: 4.7,
      reviewCount: 0,
    },
  })

  await prisma.fragranceNote.createMany({
    data: [
      { fragranceId: chanelNo5.id, noteId: bergamot.id, category: 'top', intensity: 3 },
      { fragranceId: chanelNo5.id, noteId: lemon.id, category: 'top', intensity: 3 },
      { fragranceId: chanelNo5.id, noteId: rose.id, category: 'heart', intensity: 5 },
      { fragranceId: chanelNo5.id, noteId: jasmine.id, category: 'heart', intensity: 5 },
      { fragranceId: chanelNo5.id, noteId: iris.id, category: 'heart', intensity: 4 },
      { fragranceId: chanelNo5.id, noteId: vanilla.id, category: 'base', intensity: 3 },
      { fragranceId: chanelNo5.id, noteId: sandalwood.id, category: 'base', intensity: 3 },
    ],
  })

  const savauge = await prisma.fragrance.create({
    data: {
      name: 'Sauvage',
      brandId: dior.id,
      year: 2015,
      gender: 'Men',
      concentration: 'EDT',
      description:
        'Radically fresh, raw and noble all at once. A composition that celebrates the magic of wide-open spaces. Fresh bergamot and spicy Sichuan pepper.',
      ratingAvg: 4.6,
      reviewCount: 0,
    },
  })

  await prisma.fragranceNote.createMany({
    data: [
      { fragranceId: savauge.id, noteId: bergamot.id, category: 'top', intensity: 5 },
      { fragranceId: savauge.id, noteId: blackPepper.id, category: 'top', intensity: 4 },
      { fragranceId: savauge.id, noteId: lavender.id, category: 'heart', intensity: 4 },
      { fragranceId: savauge.id, noteId: patchouli.id, category: 'base', intensity: 4 },
      { fragranceId: savauge.id, noteId: cedarwood.id, category: 'base', intensity: 3 },
      { fragranceId: savauge.id, noteId: amber.id, category: 'base', intensity: 3 },
    ],
  })

  const tomFordOud = await prisma.fragrance.create({
    data: {
      name: 'Oud Wood',
      brandId: tomFord.id,
      year: 2007,
      gender: 'Unisex',
      concentration: 'EDP',
      description:
        'Rare oud wood is surrounded by smoky vetiver and sandalwood. A composition that reveals the rich and dark blend of exotic woods.',
      ratingAvg: 4.4,
      reviewCount: 0,
    },
  })

  await prisma.fragranceNote.createMany({
    data: [
      { fragranceId: tomFordOud.id, noteId: bergamot.id, category: 'top', intensity: 2 },
      { fragranceId: tomFordOud.id, noteId: oud.id, category: 'heart', intensity: 5 },
      { fragranceId: tomFordOud.id, noteId: sandalwood.id, category: 'base', intensity: 4 },
      { fragranceId: tomFordOud.id, noteId: vetiver.id, category: 'base', intensity: 4 },
      { fragranceId: tomFordOud.id, noteId: tonkaBean.id, category: 'base', intensity: 3 },
    ],
  })

  const yslLibre = await prisma.fragrance.create({
    data: {
      name: 'Libre',
      brandId: ysl.id,
      year: 2019,
      gender: 'Women',
      concentration: 'EDP',
      description:
        'The freedom to live everything with excess. A floral lavender scent with a burning sensuality. The tension between the noble lavender from France and the bold orange blossom from Morocco.',
      ratingAvg: 4.3,
      reviewCount: 0,
    },
  })

  await prisma.fragranceNote.createMany({
    data: [
      { fragranceId: yslLibre.id, noteId: lavender.id, category: 'top', intensity: 5 },
      { fragranceId: yslLibre.id, noteId: bergamot.id, category: 'top', intensity: 3 },
      { fragranceId: yslLibre.id, noteId: jasmine.id, category: 'heart', intensity: 4 },
      { fragranceId: yslLibre.id, noteId: vanilla.id, category: 'base', intensity: 4 },
      { fragranceId: yslLibre.id, noteId: musk.id, category: 'base', intensity: 3 },
    ],
  })

  const aventus = await prisma.fragrance.create({
    data: {
      name: 'Aventus',
      brandId: creed.id,
      year: 2010,
      gender: 'Men',
      concentration: 'EDP',
      description:
        'Celebrates strength, vision and success. A sophisticated blend inspired by the dramatic life of a historic emperor. Fresh and fruity with a woody base.',
      ratingAvg: 4.8,
      reviewCount: 0,
    },
  })

  await prisma.fragranceNote.createMany({
    data: [
      { fragranceId: aventus.id, noteId: bergamot.id, category: 'top', intensity: 4 },
      { fragranceId: aventus.id, noteId: blackPepper.id, category: 'top', intensity: 3 },
      { fragranceId: aventus.id, noteId: patchouli.id, category: 'heart', intensity: 4 },
      { fragranceId: aventus.id, noteId: jasmine.id, category: 'heart', intensity: 2 },
      { fragranceId: aventus.id, noteId: musk.id, category: 'base', intensity: 4 },
      { fragranceId: aventus.id, noteId: vanilla.id, category: 'base', intensity: 3 },
    ],
  })

  console.log('Fragrances created')

  // Create Retailers
  const sephora = await prisma.retailer.upsert({
    where: { name: 'Sephora' },
    update: {},
    create: {
      name: 'Sephora',
      websiteUrl: 'https://www.sephora.com',
    },
  })

  const nordstrom = await prisma.retailer.upsert({
    where: { name: 'Nordstrom' },
    update: {},
    create: {
      name: 'Nordstrom',
      websiteUrl: 'https://www.nordstrom.com',
    },
  })

  const fragranceNet = await prisma.retailer.upsert({
    where: { name: 'FragranceNet' },
    update: {},
    create: {
      name: 'FragranceNet',
      websiteUrl: 'https://www.fragrancenet.com',
    },
  })

  console.log('Retailers created')

  // Create Retailer Links (example)
  await prisma.fragranceRetailer.upsert({
    where: {
      fragranceId_retailerId: {
        fragranceId: bleuDeChanel.id,
        retailerId: sephora.id,
      },
    },
    update: {},
    create: {
      fragranceId: bleuDeChanel.id,
      retailerId: sephora.id,
      productUrl: 'https://www.sephora.com/product/bleu-de-chanel',
      price: 135.0,
      currency: 'USD',
    },
  })

  await prisma.fragranceRetailer.upsert({
    where: {
      fragranceId_retailerId: {
        fragranceId: chanelNo5.id,
        retailerId: nordstrom.id,
      },
    },
    update: {},
    create: {
      fragranceId: chanelNo5.id,
      retailerId: nordstrom.id,
      productUrl: 'https://www.nordstrom.com/product/chanel-no-5',
      price: 150.0,
      currency: 'USD',
    },
  })

  await prisma.fragranceRetailer.upsert({
    where: {
      fragranceId_retailerId: {
        fragranceId: savauge.id,
        retailerId: fragranceNet.id,
      },
    },
    update: {},
    create: {
      fragranceId: savauge.id,
      retailerId: fragranceNet.id,
      productUrl: 'https://www.fragrancenet.com/product/sauvage',
      price: 89.99,
      currency: 'USD',
    },
  })

  console.log('Retailer links created')

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@scentelica.com' },
    update: {},
    create: {
      email: 'demo@scentelica.com',
      name: 'Demo User',
      role: 'admin',
    },
  })

  console.log('Demo user created')

  // Create sample comments
  await prisma.comment.create({
    data: {
      fragranceId: bleuDeChanel.id,
      userId: demoUser.id,
      content:
        'Absolutely love this scent! Perfect for both day and night wear. The citrus opening is refreshing and the woody dry down is sophisticated. Highly recommend!',
      rating: 5,
      helpfulCount: 12,
    },
  })

  await prisma.comment.create({
    data: {
      fragranceId: aventus.id,
      userId: demoUser.id,
      content:
        'The legendary Aventus lives up to the hype. Unique fruity opening with a smoky base. Gets tons of compliments. Worth the investment!',
      rating: 5,
      helpfulCount: 24,
    },
  })

  console.log('Sample comments created')

  console.log('Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
