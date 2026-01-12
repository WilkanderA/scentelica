'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
  userRole?: string
}

export function UserMenu({ user, userRole }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        {user.user_metadata.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.name || user.email || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
            {(user.user_metadata.name || user.email || 'U')[0].toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user.user_metadata.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              {userRole && (
                <p className="text-xs text-indigo-600 mt-1 capitalize">
                  {userRole}
                </p>
              )}
            </div>

            {userRole === 'admin' && (
              <a
                href="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Admin Dashboard
              </a>
            )}

            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
