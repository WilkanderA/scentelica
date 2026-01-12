'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CommentFormProps {
  fragranceId: string
}

export function CommentForm({ fragranceId }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [rating, setRating] = useState<number>(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Please write a review')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fragranceId,
          content: content.trim(),
          rating,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      // Reset form
      setContent('')
      setRating(5)

      // Refresh the page to show the new comment
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <svg
                className={`w-8 h-8 ${
                  value <= rating
                    ? 'text-primary fill-current'
                    : 'text-gray-300 fill-current'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600 font-medium">{rating}/5</span>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this fragrance..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
