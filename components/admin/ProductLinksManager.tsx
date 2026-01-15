'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ExistingLink {
  id: string
  productUrl: string
  price?: number | null
  currency?: string | null
  retailer: {
    name: string
    websiteUrl: string
  }
}

interface ProductLinksManagerProps {
  fragranceId: string
  existingLinks: ExistingLink[]
}

// Extract retailer name from URL
function extractRetailerName(url: string): string {
  try {
    const hostname = new URL(url).hostname
    const parts = hostname.split('.')
    // Remove 'www' and get the main domain name
    const mainPart = parts.find(p => p !== 'www' && p !== 'com' && p !== 'co' && p !== 'net') || parts[0]
    // Capitalize first letter
    return mainPart.charAt(0).toUpperCase() + mainPart.slice(1)
  } catch {
    return 'Unknown Retailer'
  }
}

export function ProductLinksManager({ fragranceId, existingLinks }: ProductLinksManagerProps) {
  const router = useRouter()
  const [newUrl, setNewUrl] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCurrency, setNewCurrency] = useState('USD')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUrl.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Validate URL
      new URL(newUrl)

      const response = await fetch(`/api/admin/fragrances/${fragranceId}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl.trim(),
          price: newPrice ? parseFloat(newPrice) : null,
          currency: newPrice ? newCurrency : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add link')
      }

      // Reset form
      setNewUrl('')
      setNewPrice('')
      setNewCurrency('USD')

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid URL or failed to add link')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this product link?')) return

    setDeletingId(linkId)
    setError(null)

    try {
      const response = await fetch(`/api/admin/fragrances/${fragranceId}/links/${linkId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete link')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete link')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Add New Link Form */}
      <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Product Link</h2>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleAddLink} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product URL *
            </label>
            <input
              type="url"
              id="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://www.sephora.com/product/..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Retailer name will be automatically extracted from the URL
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (optional)
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="99.99"
                className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={newCurrency}
                onChange={(e) => setNewCurrency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !newUrl.trim()}
            className="w-full px-6 py-3 bg-primary dark:bg-primary-dm text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Product Link'}
          </button>
        </form>
      </div>

      {/* Existing Links */}
      <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Current Product Links ({existingLinks.length})
        </h2>

        {existingLinks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No product links yet. Add one above to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {existingLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-tonal-40 rounded-lg hover:border-primary dark:hover:border-primary-dm transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {link.retailer.name}
                    </p>
                    {link.price && link.currency && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full">
                        {link.currency === 'USD' ? '$' : link.currency}
                        {link.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <a
                    href={link.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary dark:text-primary-dm hover:underline break-all"
                  >
                    {link.productUrl}
                  </a>
                </div>

                <button
                  onClick={() => handleDeleteLink(link.id)}
                  disabled={deletingId === link.id}
                  className="ml-4 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete link"
                >
                  {deletingId === link.id ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
