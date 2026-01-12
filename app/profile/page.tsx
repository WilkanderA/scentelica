import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { SignOutButton } from '@/components/auth/SignOutButton'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Get user data from database with all collections
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      comments: {
        include: {
          fragrance: {
            include: {
              brand: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      userFragrances: {
        include: {
          fragrance: {
            include: {
              brand: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  // Separate fragrances by status
  const wishlist = dbUser?.userFragrances.filter((uf: any) => uf.status === 'wishlist') || []
  const collection = dbUser?.userFragrances.filter((uf: any) => uf.status === 'collection') || []
  const wantToTry = dbUser?.userFragrances.filter((uf: any) => uf.status === 'want_to_try') || []

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-10">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              {user.user_metadata.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.name || user.email || 'User'}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                  {(user.user_metadata.name || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.user_metadata.name || 'User'}
                </h1>
                <p className="text-gray-600 dark:text-surface-50 mb-2">{user.email}</p>
                {dbUser?.role && (
                  <span className="inline-block px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-sm font-medium capitalize">
                    {dbUser.role}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {dbUser?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium text-center shadow-md"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  Admin Dashboard
                </Link>
              )}
              <SignOutButton />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {collection.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-surface-50">Collection</div>
          </div>
          <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {wishlist.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-surface-50">Wishlist</div>
          </div>
          <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {wantToTry.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-surface-50">Want to Try</div>
          </div>
          <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {dbUser?.comments.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-surface-50">Reviews</div>
          </div>
          <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {dbUser?.comments.reduce((sum, c) => sum + c.helpfulCount, 0) || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-surface-50">Helpful Votes</div>
          </div>
        </div>

        {/* Collection Sections */}
        <div className="space-y-8">
          {/* My Collection */}
          <CollectionSection
            title="My Collection"
            items={collection}
            emptyMessage="Your collection is empty. Start adding fragrances you own!"
          />

          {/* Wishlist */}
          <CollectionSection
            title="Wishlist"
            items={wishlist}
            emptyMessage="Your wishlist is empty. Add fragrances you want to buy!"
          />

          {/* Want to Try */}
          <CollectionSection
            title="Want to Try"
            items={wantToTry}
            emptyMessage="Add fragrances you're curious about and want to sample!"
          />

          {/* Reviews */}
          <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Reviews</h2>
            {dbUser?.comments && dbUser.comments.length > 0 ? (
              <div className="space-y-6">
                {dbUser.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-200 dark:border-neutral-700 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      {comment.fragrance.bottleImageUrl && (
                        <img
                          src={comment.fragrance.bottleImageUrl}
                          alt={comment.fragrance.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <a
                              href={`/fragrances/${comment.fragrance.id}`}
                              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors"
                            >
                              {comment.fragrance.name}
                            </a>
                            <p className="text-sm text-gray-500 dark:text-surface-50">
                              {comment.fragrance.brand.name}
                            </p>
                          </div>
                          {comment.rating && (
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                              <svg className="w-4 h-4 fill-current" style={{ color: '#D4AF37' }} viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                              <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
                                {comment.rating}/5
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-surface-60 mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-surface-50">
                          <span>{formatDate(comment.createdAt)}</span>
                          <span>•</span>
                          <span>{comment.helpfulCount} found helpful</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-surface-50 mb-4">You haven't written any reviews yet</p>
                <Link
                  href="/fragrances"
                  className="inline-block px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-md"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  Browse Fragrances
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Collection Section Component
function CollectionSection({ title, items, emptyMessage }: {
  title: string
  items: any[]
  emptyMessage: string
}) {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-surface-50 mb-4">{emptyMessage}</p>
          <Link
            href="/fragrances"
            className="inline-block px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-md"
            style={{ backgroundColor: '#D4AF37' }}
          >
            Browse Fragrances
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title} ({items.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/fragrances/${item.fragrance.id}`}
            className="group border border-gray-200 dark:border-neutral-700 rounded-lg p-4 hover:border-primary transition-colors"
          >
            <div className="flex gap-4">
              {item.fragrance.bottleImageUrl ? (
                <img
                  src={item.fragrance.bottleImageUrl}
                  alt={item.fragrance.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-1">
                  {item.fragrance.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-surface-50 mb-2">{item.fragrance.brand.name}</p>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 fill-current" style={{ color: '#D4AF37' }} viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>{item.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
            {item.notes && (
              <p className="text-sm text-gray-600 dark:text-surface-50 mt-3 line-clamp-2">{item.notes}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
