# Scentelica - Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (recommended: Vercel Postgres, Supabase, or Railway)

## Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository (if not already done)
```bash
cd C:\Coding\scentelica
git init
git add .
git commit -m "Initial commit - Scentelica fragrance website"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `scentelica`
3. Don't initialize with README (we already have one)
4. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/scentelica.git
git branch -M main
git push -u origin main
```

### 1.3 Update .gitignore
Make sure sensitive files are not committed (already configured):
```
.env
.env.local
.env*.local
node_modules
.next
```

## Step 2: Set Up Production Database

### Option A: Vercel Postgres (Recommended - Easiest)
1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose a name (e.g., `scentelica-db`)
5. Select region closest to your users
6. Copy the connection strings provided

### Option B: Supabase (Free tier available)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (Transaction mode for `DATABASE_URL`)
5. Copy "Connection string" (Session mode for `DATABASE_DIRECT_URL`)

### Option C: Railway (Simple setup)
1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy connection strings from "Connect" tab

## Step 3: Configure Environment Variables

You'll need these environment variables in Vercel:

### Required Variables:
```env
# Database - Main connection (for Prisma migrations)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Database - Direct connection (for Prisma Client with pg adapter)
DATABASE_DIRECT_URL="postgresql://user:password@host:port/database?sslmode=require"

# Base URL for sitemap and SEO
NEXT_PUBLIC_BASE_URL="https://your-app-name.vercel.app"

# Node environment
NODE_ENV="production"
```

### Notes:
- For Vercel Postgres, these will be automatically populated when you connect the database
- For external databases, use the connection strings from your provider
- Make sure both URLs use SSL in production (`sslmode=require`)

## Step 4: Deploy to Vercel

### 4.1 Connect Repository
1. Go to https://vercel.com/new
2. Import your GitHub repository `scentelica`
3. Vercel will auto-detect Next.js settings

### 4.2 Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (default)

**Build Command:** `npm run build` (default)

**Output Directory:** `.next` (default)

**Install Command:** `npm install` (default)

### 4.3 Add Environment Variables
1. In Vercel project settings → "Environment Variables"
2. Add all variables from Step 3
3. Select environments: Production, Preview, Development

### 4.4 Connect Database (if using Vercel Postgres)
1. In your Vercel project → "Storage" tab
2. Click "Connect Store"
3. Select your Postgres database
4. Vercel will automatically inject the environment variables

## Step 5: Run Database Migrations

After first deployment, you need to run migrations:

### Option 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations using production env
npx prisma migrate deploy --schema ./prisma/schema.prisma
```

### Option 2: Using Vercel Postgres Dashboard
1. Go to your database in Vercel
2. Use the "Query" tab
3. Run the SQL from your migration files manually

### Option 3: Add Build Script (Automated)
Add to `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## Step 6: Seed Database (Optional but Recommended)

Run seed script to populate initial data:

```bash
# Using Vercel CLI with production env
vercel env pull .env.production
npx prisma db seed
```

Or manually insert data through your database provider's dashboard.

## Step 7: Update Prisma Configuration for Production

### Update prisma/schema.prisma
Already configured correctly, but verify:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DATABASE_DIRECT_URL")
}
```

### Update lib/db.ts
Already configured with pg adapter - no changes needed!

## Step 8: Verify Deployment

1. **Check Build Logs**
   - Vercel Dashboard → Deployments → Latest deployment
   - Look for any errors in build output

2. **Test Key Pages**
   - Homepage: `https://your-app.vercel.app/`
   - Browse: `https://your-app.vercel.app/fragrances`
   - Detail: `https://your-app.vercel.app/fragrances/[id]`
   - Admin: `https://your-app.vercel.app/admin`

3. **Test Database Connection**
   - Try loading a fragrance page
   - Try creating a new fragrance in admin panel
   - Check for any database errors in logs

4. **Test SEO**
   - View page source, check for metadata
   - Test: `https://your-app.vercel.app/sitemap.xml`
   - Test: `https://your-app.vercel.app/robots.txt`

5. **Test Images**
   - Check if fragrance images load properly
   - Verify Next.js Image optimization is working

## Step 9: Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `scentelica.com`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_BASE_URL` environment variable
5. Redeploy the application

## Step 10: Secure Admin Routes (Important!)

Currently, admin routes are public. You need to add authentication:

### Quick Solution: Environment-based Password
Create `middleware.ts` in project root:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization');
    const url = request.nextUrl;

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASSWORD) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

Add to Vercel environment variables:
```
ADMIN_USER="admin"
ADMIN_PASSWORD="your-secure-password"
```

### Better Solution: NextAuth.js (Future Enhancement)
Implement proper authentication with NextAuth.js for production use.

## Common Issues & Solutions

### Issue 1: Build Fails - Prisma Client Not Generated
**Solution:** Ensure `prisma generate` runs before build:
```json
"scripts": {
  "build": "prisma generate && next build"
}
```

### Issue 2: Database Connection Fails
**Solution:**
- Verify `DATABASE_DIRECT_URL` is set
- Check SSL mode is correct (`sslmode=require` for production)
- Verify database allows connections from Vercel IPs

### Issue 3: Images Not Loading
**Solution:**
- Verify image URLs are accessible
- Check `next.config.ts` has correct `remotePatterns`
- Ensure HTTPS for production image URLs

### Issue 4: "Function Duration Exceeded"
**Solution:**
- Optimize database queries
- Add indexes to frequently queried fields
- Consider caching with Vercel KV or Redis

### Issue 5: API Routes Return 500
**Solution:**
- Check Vercel logs for detailed error messages
- Verify environment variables are set correctly
- Check database connection and queries

## Performance Optimization

### 1. Enable Caching
Add to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};
```

### 2. Use Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Enable ISR (Incremental Static Regeneration)
Update page configurations to revalidate:
```typescript
export const revalidate = 3600; // Revalidate every hour
```

## Monitoring & Maintenance

### Set Up Monitoring
1. **Vercel Analytics:** Enable in project settings
2. **Error Tracking:** Consider Sentry integration
3. **Uptime Monitoring:** Use UptimeRobot or similar

### Regular Maintenance
- Monitor database size and performance
- Update dependencies regularly: `npm update`
- Review Vercel logs for errors
- Backup database regularly

## Post-Deployment Checklist

- [ ] Application is live and accessible
- [ ] Database is connected and migrations applied
- [ ] Seed data is loaded (at least a few fragrances)
- [ ] All pages load without errors
- [ ] Images load and display correctly
- [ ] Admin panel is accessible and functional
- [ ] Search and filtering work correctly
- [ ] Sitemap.xml is generated correctly
- [ ] Robots.txt is accessible
- [ ] SEO metadata is present in page source
- [ ] Mobile responsiveness verified
- [ ] Admin routes are protected
- [ ] Environment variables are set correctly
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Performance is acceptable (< 3s load time)

## Useful Commands

```bash
# Pull production environment variables
vercel env pull .env.production

# View deployment logs
vercel logs

# Promote preview deployment to production
vercel promote [deployment-url]

# Rollback to previous deployment
vercel rollback

# Check deployment status
vercel inspect [deployment-url]
```

## Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment
- **Vercel Community:** https://github.com/vercel/next.js/discussions

## Estimated Costs

### Free Tier Includes:
- Unlimited deployments
- 100GB bandwidth/month
- Vercel Analytics (basic)
- SSL certificates
- Preview deployments

### Paid Resources:
- **Vercel Postgres:** Free tier → $20/mo for production
- **Vercel Pro:** $20/mo (for team features, more bandwidth)
- **Custom Domain:** ~$10-15/year

Most small-medium sites run fine on free/hobby tier!

---

## Quick Start Commands

```bash
# 1. Build locally to test
npm run build

# 2. Initialize git
git init
git add .
git commit -m "Ready for deployment"

# 3. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/scentelica.git
git push -u origin main

# 4. Deploy to Vercel
# Go to vercel.com/new and import your repository

# 5. Run migrations (after connecting database)
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

That's it! Your Scentelica website should now be live on Vercel! 🚀
