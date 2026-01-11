# Scentelica - Pre-Deployment Checklist

Use this checklist before deploying to Vercel.

## Local Verification

### Build & Test
- [ ] Run `npm run build` - Build succeeds without errors
- [ ] Run `npm run dev` - Dev server runs without errors
- [ ] Test homepage loads correctly
- [ ] Test fragrances browse page with filters
- [ ] Test individual fragrance detail page
- [ ] Test admin panel (all CRUD operations)
- [ ] Test mobile responsiveness (use browser dev tools)
- [ ] Check console for any errors

### Code Quality
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] .gitignore is properly configured
- [ ] No sensitive data in code (API keys, passwords, etc.)
- [ ] Environment variables are documented
- [ ] All images use Next.js Image component

### Files to Verify
- [ ] `.env` is in .gitignore (never commit this!)
- [ ] `package.json` has correct build scripts
- [ ] `next.config.ts` is properly configured
- [ ] `middleware.ts` exists for admin protection
- [ ] Database schema is finalized in `prisma/schema.prisma`

## Git Repository

### Setup
- [ ] Git repository initialized
- [ ] All files committed: `git add .` && `git commit -m "Initial commit"`
- [ ] Repository pushed to GitHub
- [ ] Repository is public OR you have Vercel connected to private repos

### Files to Check
```bash
# Run these commands to verify:
git status                    # Should be clean
git log                       # Should have your commits
git remote -v                 # Should show GitHub URL
```

## Database Preparation

### Choose Your Database Provider
- [ ] Decision made: Vercel Postgres / Supabase / Railway / Other
- [ ] Account created with chosen provider
- [ ] Database instance created
- [ ] Connection strings obtained

### Connection Strings Needed
- [ ] `DATABASE_URL` (for migrations and Prisma operations)
- [ ] `DATABASE_DIRECT_URL` (for pg adapter connection)

### Test Connection
```bash
# Test your database connection strings locally:
# 1. Create .env.production with production database URLs
# 2. Run: npx prisma db execute --stdin <<< "SELECT 1"
# 3. Should return "Script executed successfully"
```

## Environment Variables

Create a list of all environment variables needed:

### Required for Production
```env
DATABASE_URL="postgresql://..."
DATABASE_DIRECT_URL="postgresql://..."
NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"
NODE_ENV="production"
```

### Optional (Admin Protection)
```env
ADMIN_USER="admin"
ADMIN_PASSWORD="your-secure-password-here"
```

### Verification
- [ ] All variables documented
- [ ] No placeholder values (like "changeme")
- [ ] Database URLs use SSL (`sslmode=require`)
- [ ] Passwords are strong and unique

## Vercel Setup

### Account & Project
- [ ] Vercel account created
- [ ] GitHub account connected to Vercel
- [ ] Ready to import repository

### Deployment Settings
- [ ] Framework: Next.js (auto-detected)
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `.next` (default)
- [ ] Install Command: `npm install` (default)
- [ ] Root Directory: `./` (default)
- [ ] Node.js Version: 18.x or higher

## Post-Deployment Steps

### Immediately After First Deploy
- [ ] Deployment succeeded (check Vercel dashboard)
- [ ] Pull environment variables: `vercel env pull`
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Run seed script: `npx prisma db seed`
- [ ] Verify site is accessible

### Testing Production
- [ ] Homepage loads: `https://your-app.vercel.app/`
- [ ] Fragrances page loads and shows data
- [ ] Individual fragrance page loads
- [ ] Images display correctly
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Admin login works (basic auth prompt appears)
- [ ] Can create a new fragrance in admin
- [ ] Can edit an existing fragrance
- [ ] Can delete a fragrance

### SEO & Performance
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`
- [ ] View page source - metadata is present
- [ ] OpenGraph tags present (test with [og debugger](https://www.opengraph.xyz/))
- [ ] Page load time < 3 seconds
- [ ] Mobile Lighthouse score > 80

### Security
- [ ] Admin routes require authentication
- [ ] Database credentials not exposed
- [ ] Environment variables secured in Vercel
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Database connection uses SSL

## Common Pre-Deployment Fixes

### If Build Fails
```bash
# 1. Test build locally first
npm run build

# 2. Check for TypeScript errors
npx tsc --noEmit

# 3. Verify Prisma generates correctly
npx prisma generate
```

### If Database Connection Fails
- Check connection strings have no typos
- Verify SSL mode is correct for provider
- Test connection locally first
- Check database allows connections from Vercel IPs

### If Images Don't Load
- Verify image URLs are HTTPS in production
- Check `next.config.ts` has `remotePatterns` configured
- Test image URLs directly in browser

## Rollback Plan

If deployment has issues:

1. **Vercel Dashboard** → Your Project → Deployments
2. Find previous working deployment
3. Click "Promote to Production"
4. Fix issues locally and redeploy

## Budget Check

### Free Tier Limits (Vercel Hobby)
- Deployments: Unlimited ✓
- Bandwidth: 100GB/month
- Serverless Function Duration: 10s
- Serverless Function Size: 50MB

### Database Costs
- Vercel Postgres: Free tier available, then $20/mo
- Supabase: 500MB free, then $25/mo
- Railway: $5 credit/month, pay as you go

## Support Resources

If you encounter issues:
- [ ] Check Vercel deployment logs
- [ ] Review build output for errors
- [ ] Check [Vercel Docs](https://vercel.com/docs)
- [ ] Check [Next.js Docs](https://nextjs.org/docs)
- [ ] Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Final Go/No-Go Decision

### Requirements for Deploy
- [ ] All local tests pass
- [ ] Build succeeds with no errors
- [ ] Git repository pushed to GitHub
- [ ] Database provider selected and ready
- [ ] Environment variables prepared
- [ ] Vercel account ready

### If All Checked Above
✅ **READY TO DEPLOY!**

### If Any Unchecked
❌ **Do NOT deploy yet** - Address remaining items first

---

## Quick Deploy Commands

Once everything is ready:

```bash
# Final local verification
npm run build

# Commit any final changes
git add .
git commit -m "Ready for production deployment"
git push origin main

# Now go to https://vercel.com/new and import your repository!
```

## After Successful Deployment

- [ ] Update `NEXT_PUBLIC_BASE_URL` with actual Vercel URL
- [ ] Share the URL and celebrate! 🎉
- [ ] Monitor for any errors in first 24 hours
- [ ] Set up uptime monitoring (optional)
- [ ] Plan for custom domain (optional)

---

**Last Updated:** 2026-01-11
**Project:** Scentelica Fragrance Website
**Status:** Ready for Deployment ✓
