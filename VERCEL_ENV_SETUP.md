# Vercel Environment Variables Setup

## Critical: Add These Environment Variables to Vercel

Go to: https://vercel.com/wilkanders-projects/scentelica/settings/environment-variables

### Add these TWO variables:

#### 1. DATABASE_URL (for application queries - pooled connection)
```
postgres://postgres.qooztzrpftpbiqhzawqf:l4WJvTpqkOq6vdAC@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```
- Environment: **Production, Preview, Development** (select all)

#### 2. DATABASE_DIRECT_URL (for pg adapter - direct connection)
```
postgres://postgres.qooztzrpftpbiqhzawqf:l4WJvTpqkOq6vdAC@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```
- Environment: **Production, Preview, Development** (select all)

## What's Already Set in Vercel (keep these):
- ✅ ADMIN_USER
- ✅ ADMIN_PASSWORD
- ✅ NEXT_PUBLIC_BASE_URL
- ✅ All SUPABASE_* variables
- ✅ All POSTGRES_* variables

## After Adding:
1. Click "Save" for each variable
2. Vercel will automatically trigger a redeploy
3. Wait for the deployment to complete (~30-60 seconds)
4. Visit https://scentelica.vercel.app - your site should now work!

## Why These Are Needed:
- Your app currently connects to `127.0.0.1:5432` (localhost) in production
- These variables tell it to connect to Supabase instead
- `DATABASE_URL` (port 6543) = pooled connection for queries
- `DATABASE_DIRECT_URL` (port 5432) = direct connection for pg adapter
