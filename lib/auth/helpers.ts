import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentUserWithRole() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
    },
  })

  return dbUser
}

export async function isAdmin() {
  const userWithRole = await getCurrentUserWithRole()
  return userWithRole?.role === 'admin'
}
