'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface PerfumeDBEntry {
  brand: string
  perfume: string
  image?: string
  launch_year?: string
  main_accords?: string
  notes?: string
  longevity?: string
  sillage?: string
}

const EXAMPLE_JSON = `[
  {
    "name": "Chanel No 5",
    "brand": "Chanel",
    "year": 1921,
    "gender": "Women",
    "concentration": "Parfum",
    "description": "A timeless floral aldehyde fragrance",
    "bottleImageUrl": "https://example.com/chanel-no5.jpg",
    "notes": {
      "top": ["Aldehydes", "Ylang-Ylang", "Neroli"],
      "heart": ["Jasmine", "Rose", "Lily of the Valley"],
      "base": ["Sandalwood", "Vanilla", "Vetiver"]
    }
  },
  {
    "name": "Sauvage",
    "brand": "Dior",
    "year": 2015,
    "gender": "Men",
    "concentration": "Eau de Toilette",
    "description": "A fresh and spicy fragrance",
    "notes": {
      "top": ["Bergamot", "Pepper"],
      "heart": ["Lavender", "Geranium"],
      "base": ["Ambroxan", "Cedar", "Labdanum"]
    }
  }
]`

export function BulkImportForm() {
  const router = useRouter()
  const [jsonData, setJsonData] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert perfume database format to our import format
  const convertPerfumeDBFormat = (data: PerfumeDBEntry[]) => {
    return data.map((entry) => {
      let notesObj: { top?: string[]; heart?: string[]; base?: string[] } = {}

      if (entry.notes) {
        try {
          const parsedNotes = JSON.parse(entry.notes)

          if (Array.isArray(parsedNotes)) {
            // Flat array - put all in top notes
            notesObj = { top: parsedNotes }
          } else if (typeof parsedNotes === 'object') {
            // Object with categories
            notesObj = {
              top: parsedNotes.top || [],
              heart: parsedNotes.middle || parsedNotes.heart || [],
              base: parsedNotes.base || [],
            }
          }
        } catch {
          // If parsing fails, skip notes
        }
      }

      return {
        name: entry.perfume,
        brand: entry.brand,
        year: entry.launch_year ? parseInt(entry.launch_year) : undefined,
        bottleImageUrl: entry.image || undefined,
        notes: notesObj,
      }
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setResult(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = JSON.parse(content)

        if (!Array.isArray(data)) {
          throw new Error('JSON must be an array')
        }

        // Check if it's perfume database format (has "perfume" field)
        if (data.length > 0 && data[0].perfume) {
          const converted = convertPerfumeDBFormat(data)
          setJsonData(JSON.stringify(converted, null, 2))
        } else {
          // Already in correct format
          setJsonData(JSON.stringify(data, null, 2))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file')
      }
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setResult(null)

    try {
      // Validate JSON
      let fragrances
      try {
        fragrances = JSON.parse(jsonData)
      } catch (err) {
        throw new Error('Invalid JSON format. Please check your syntax.')
      }

      if (!Array.isArray(fragrances)) {
        throw new Error('JSON must be an array of fragrance objects.')
      }

      if (fragrances.length === 0) {
        throw new Error('No fragrances to import.')
      }

      // Send to API
      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragrances }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import fragrances')
      }

      setResult(data)

      if (data.success > 0) {
        // Clear form on success
        setJsonData('')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import fragrances')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadExample = () => {
    setJsonData(EXAMPLE_JSON)
    setError(null)
    setResult(null)
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
          Import Format
        </h2>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>Paste a JSON array of fragrance objects with the following structure:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Required:</strong> name, brand</li>
            <li><strong>Optional:</strong> year, gender, concentration, description, bottleImageUrl</li>
            <li><strong>Notes:</strong> Object with top, heart, and base arrays (note names will be auto-created)</li>
          </ul>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={loadExample}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
          >
            Load Example
          </button>
          <label className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:opacity-90 transition-colors text-sm font-medium cursor-pointer">
            Upload JSON File
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
          Supports both standard format and perfume database format (auto-converts)
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg">
          <p className="font-semibold mb-1">Import Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className={`border rounded-xl p-6 ${
          result.failed === 0
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <h2 className={`text-lg font-bold mb-3 ${
            result.failed === 0
              ? 'text-green-900 dark:text-green-300'
              : 'text-yellow-900 dark:text-yellow-300'
          }`}>
            Import Complete
          </h2>
          <div className={`space-y-2 text-sm ${
            result.failed === 0
              ? 'text-green-800 dark:text-green-200'
              : 'text-yellow-800 dark:text-yellow-200'
          }`}>
            <p>✓ Successfully imported: <strong>{result.success}</strong> fragrance{result.success !== 1 ? 's' : ''}</p>
            {result.failed > 0 && (
              <>
                <p>✗ Failed: <strong>{result.failed}</strong> fragrance{result.failed !== 1 ? 's' : ''}</p>
                {result.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold mb-1">Errors:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {result.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Import Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-6 space-y-4">
        <div>
          <label htmlFor="jsonData" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fragrance Data (JSON)
          </label>
          <textarea
            id="jsonData"
            required
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            rows={20}
            placeholder="Paste your JSON array here..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !jsonData.trim()}
          className="w-full px-6 py-3 bg-primary dark:bg-primary-dm text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Importing...' : 'Import Fragrances'}
        </button>
      </form>
    </div>
  )
}
