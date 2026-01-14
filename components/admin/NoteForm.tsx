'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface NoteFormProps {
  initialData?: {
    id?: string;
    name: string;
    category: string;
    description?: string | null;
    imageUrl?: string | null;
  };
}

export function NoteForm({ initialData }: NoteFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'top',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = initialData?.id
        ? `/api/admin/notes/${initialData.id}`
        : '/api/admin/notes'

      const method = initialData?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim() || null,
          imageUrl: formData.imageUrl.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save note')
      }

      router.push('/admin/notes')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return

    if (!confirm('Are you sure you want to delete this note? This will remove it from all fragrances that use it.')) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/notes/${initialData.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete note')
      }

      router.push('/admin/notes')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note')
      setIsSubmitting(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'top':
        return 'bg-accent-mint/20 dark:bg-accent-mint/30 border-accent-mint/30';
      case 'heart':
        return 'bg-accent-lavender/20 dark:bg-accent-lavender/30 border-accent-lavender/30';
      case 'base':
        return 'bg-accent-rose/20 dark:bg-accent-rose/30 border-accent-rose/30';
      default:
        return 'bg-gray-100 dark:bg-tonal-30 border-gray-200';
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
          Note Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
          placeholder="e.g., Bergamot, Vanilla, Sandalwood"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['top', 'heart', 'base'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFormData({ ...formData, category: cat })}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                formData.category === cat
                  ? `${getCategoryColor(cat)} border-current`
                  : 'bg-white dark:bg-tonal-30 border-gray-300 dark:border-tonal-40 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-tonal-50'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100 resize-none"
          placeholder="Describe the scent profile, characteristics, or common associations..."
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
          placeholder="https://example.com/note-image.jpg"
        />
        {formData.imageUrl && (
          <div className="mt-4 relative aspect-square max-w-xs bg-gray-100 dark:bg-tonal-30 rounded-lg overflow-hidden">
            <Image
              src={formData.imageUrl}
              alt="Note preview"
              fill
              className="object-cover"
              onError={() => setFormData({ ...formData, imageUrl: '' })}
            />
          </div>
        )}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Tip: Upload your image to a service like Imgur or use a direct image URL
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !formData.name.trim()}
          className="flex-1 px-6 py-3 bg-primary dark:bg-primary-dm text-white rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Note' : 'Create Note'}
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
