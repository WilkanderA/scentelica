import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Check admin role from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  if (dbUser?.role !== 'admin') {
    redirect('/')
  }

  return <>{children}</>
}
