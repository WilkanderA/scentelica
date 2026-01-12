import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
  userRole?: string
}

export function UserMenu({ user, userRole }: UserMenuProps) {
  return (
    <a
      href="/profile"
      className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
      title="Go to profile"
    >
      {user.user_metadata.avatar_url ? (
        <img
          src={user.user_metadata.avatar_url}
          alt={user.user_metadata.name || user.email || 'User'}
          className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-primary transition-colors"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium border-2 border-gray-200 hover:border-primary-dark transition-colors">
          {(user.user_metadata.name || user.email || 'U')[0].toUpperCase()}
        </div>
      )}
    </a>
  )
}
