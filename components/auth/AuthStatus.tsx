import { createClient } from '@/lib/supabase/server'
import { SignInButton } from './SignInButton'
import { UserMenu } from './UserMenu'
import { prisma } from '@/lib/db'

export async function AuthStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <SignInButton />
  }

  // Get user role from database
  let userRole: string | undefined
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    userRole = dbUser?.role
  } catch (error) {
    console.error('Error fetching user role:', error)
  }

  return <UserMenu user={user} userRole={userRole} />
}
