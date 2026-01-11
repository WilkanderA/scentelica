# Scentelica - Modern Fragrance Discovery Platform

A modern, user-friendly fragrance discovery website built to compete with Fragrantica. Explore perfumes, discover notes, read reviews, and find where to buy your favorite scents.

## Features

- **Beautiful Modern UI**: Clean, spacious design with generous whitespace
- **Fragrance Browse & Search**: Find fragrances easily with powerful filtering
- **Detailed Fragrance Pages**: View notes pyramids, descriptions, and ratings
- **Notes Visualization**: Interactive display of top, heart, and base notes
- **Brand Directory**: Explore fragrances from the world's finest perfume houses
- **Notes Library**: Learn about the building blocks of perfumery
- **Retailer Links**: Find where to buy fragrances with pricing information
- **User Reviews**: Read authentic reviews from fragrance enthusiasts
- **Admin Panel**: Manage fragrances and content

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed

### Installation

1. Clone the repository:
```bash
cd scentelica
```

2. Install dependencies:
```bash
npm install
```

3. Start the local Prisma Postgres database:
```bash
npx prisma dev
```

4. In a new terminal, push the database schema:
```bash
npm run db:push
```

5. Seed the database with sample data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Management

- **View database**: `npm run db:studio` - Opens Prisma Studio
- **Push schema**: `npm run db:push` - Updates database schema
- **Seed database**: `npm run db:seed` - Populates with sample data

## Project Structure

```
scentelica/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── fragrances/          # Fragrance pages
│   │   ├── page.tsx         # Browse fragrances
│   │   └── [id]/page.tsx    # Individual fragrance detail
│   ├── brands/page.tsx      # Brands directory
│   ├── notes/page.tsx       # Notes library
│   └── admin/               # Admin panel
├── components/              # React components
│   ├── Navigation.tsx       # Main navigation
│   ├── SearchBar.tsx        # Search functionality
│   ├── FragranceCard.tsx    # Fragrance card component
│   ├── FragranceHeader.tsx  # Fragrance detail header
│   ├── NotesVisualization.tsx # Notes pyramid display
│   ├── RetailerLinks.tsx    # Where to buy section
│   ├── CommentSection.tsx   # User reviews
│   └── FilterSidebar.tsx    # Browse filters
├── lib/
│   └── db.ts                # Prisma client
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
└── package.json             # Dependencies
```

## Database Schema

- **Brands**: Perfume houses (Chanel, Dior, etc.)
- **Fragrances**: Individual perfumes with details
- **Notes**: Fragrance notes library (top, heart, base)
- **FragranceNotes**: Junction table for fragrance-note relationships
- **Retailers**: Where to buy (Sephora, Nordstrom, etc.)
- **FragranceRetailers**: Product links with pricing
- **Users**: User accounts for authentication
- **Comments**: User reviews and ratings

## Features Coming Soon

- User authentication with Google OAuth
- User wishlists and favorites
- Advanced fragrance recommendations
- Comparison tool
- Community forums
- Email notifications
- Mobile app

## Design Principles

- **Clean & Modern**: No clutter, generous whitespace
- **Mobile-First**: Optimized for phone browsing
- **Fast**: Instant search, smooth transitions
- **Visual**: High-quality imagery and interactive visualizations
- **User-Focused**: Simple, intuitive navigation

## Contributing

This is a personal project, but suggestions are welcome! Feel free to open issues for bugs or feature requests.

## License

MIT

## Acknowledgments

- Inspired by the need for a modern fragrance discovery platform
- Built with Claude Code
