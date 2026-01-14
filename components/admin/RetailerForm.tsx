'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface RetailerFormProps {
  initialData?: {
    id?: string;
    name: string;
    websiteUrl: string;
    logoUrl?: string | null;
  };
}

export function RetailerForm({ initialData }: RetailerFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    websiteUrl: initialData?.websiteUrl || '',
    logoUrl: initialData?.logoUrl || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = initialData?.id
        ? `/api/admin/retailers/${initialData.id}`
        : '/api/admin/retailers'

      const method = initialData?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          websiteUrl: formData.websiteUrl.trim(),
          logoUrl: formData.logoUrl.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save retailer')
      }

      router.push('/admin/retailers')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save retailer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return

    if (!confirm('Are you sure you want to delete this retailer? This will remove all product links associated with it.')) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/retailers/${initialData.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete retailer')
      }

      router.push('/admin/retailers')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete retailer')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Retailer Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
          placeholder="e.g., Sephora, Nordstrom, FragranceNet"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Website URL *
        </label>
        <input
          type="url"
          id="websiteUrl"
          required
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
          placeholder="https://www.example.com"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The main website URL for this retailer
        </p>
      </div>

      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Logo URL
        </label>
        <input
          type="url"
          id="logoUrl"
          value={formData.logoUrl}
          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
          placeholder="https://example.com/logo.png"
        />
        {formData.logoUrl && (
          <div className="mt-4 relative w-32 h-32 bg-gray-100 dark:bg-tonal-30 rounded-lg overflow-hidden p-4">
            <Image
              src={formData.logoUrl}
              alt="Retailer logo preview"
              fill
              className="object-contain p-2"
              onError={() => setFormData({ ...formData, logoUrl: '' })}
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !formData.name.trim() || !formData.websiteUrl.trim()}
          className="flex-1 px-6 py-3 bg-primary dark:bg-primary-dm text-white rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Retailer' : 'Create Retailer'}
        </button>

        {initialData?.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
