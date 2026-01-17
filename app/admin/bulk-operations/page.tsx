'use client'

import { useState, useRef } from 'react'

export default function BulkOperationsPage() {
  const [isClearing, setIsClearing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isFixingUrls, setIsFixingUrls] = useState(false)
  const [isUpdatingFromJson, setIsUpdatingFromJson] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [fixUrlResult, setFixUrlResult] = useState<{ success: boolean; message: string } | null>(null)
  const [jsonImageResult, setJsonImageResult] = useState<{ success: boolean; message: string } | null>(null)
  const [csvData, setCsvData] = useState('')
  const [updateResult, setUpdateResult] = useState<{
    updated: number
    failed: number
    errors: string[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClearImages = async () => {
    if (!confirm('Are you sure you want to clear ALL fragrance bottle images? This cannot be undone.')) {
      return
    }

    setIsClearing(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/bulk-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-images' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear images')
      }

      setResult({ success: true, message: data.message })
    } catch (err) {
      setResult({ success: false, message: err instanceof Error ? err.message : 'Failed to clear images' })
    } finally {
      setIsClearing(false)
    }
  }

  const handleFixImageUrls = async () => {
    if (!confirm('This will prefix all image filenames like "o.xxxxx.jpg" with "https://fimgs.net/images/perfume/". Continue?')) {
      return
    }

    setIsFixingUrls(true)
    setFixUrlResult(null)

    try {
      const response = await fetch('/api/admin/bulk-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fix-image-urls' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix image URLs')
      }

      setFixUrlResult({ success: true, message: data.message })
    } catch (err) {
      setFixUrlResult({ success: false, message: err instanceof Error ? err.message : 'Failed to fix image URLs' })
    } finally {
      setIsFixingUrls(false)
    }
  }

  const handleUpdateImagesFromJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUpdatingFromJson(true)
    setJsonImageResult(null)

    try {
      const content = await file.text()

      // Try to parse the JSON, handling potential issues with large files
      let data
      try {
        data = JSON.parse(content)
      } catch (parseError) {
        // Try to fix common JSON issues (trailing content, etc.)
        const trimmed = content.trim()
        // Find the last valid array bracket
        const lastBracket = trimmed.lastIndexOf(']')
        if (lastBracket > 0) {
          data = JSON.parse(trimmed.substring(0, lastBracket + 1))
        } else {
          throw parseError
        }
      }

      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array')
      }

      // Process in batches of 1000 to avoid request size limits
      const batchSize = 1000
      let totalUpdated = 0
      let totalSkipped = 0
      let totalNotFound = 0

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize)

        setJsonImageResult({
          success: true,
          message: `Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(data.length / batchSize)}... (${i} / ${data.length})`
        })

        const response = await fetch('/api/admin/bulk-operations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update-images-from-json', data: batch }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update images')
        }

        // Parse the result message to extract numbers
        const match = result.message.match(/Updated (\d+).*Skipped (\d+).*: (\d+)/)
        if (match) {
          totalUpdated += parseInt(match[1])
          totalSkipped += parseInt(match[2])
          totalNotFound += parseInt(match[3])
        }
      }

      setJsonImageResult({
        success: true,
        message: `Completed! Updated ${totalUpdated} fragrances with images. Skipped ${totalSkipped} (no image). Not found/already has image: ${totalNotFound}.`
      })
    } catch (err) {
      setJsonImageResult({ success: false, message: err instanceof Error ? err.message : 'Failed to update images' })
    } finally {
      setIsUpdatingFromJson(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleBulkUpdateImages = async () => {
    setIsUpdating(true)
    setUpdateResult(null)

    try {
      // Parse CSV: name,brand,imageUrl
      const lines = csvData.trim().split('\n')
      const updates = lines.slice(1).map(line => {
        const [name, brand, imageUrl] = line.split(',').map(s => s.trim())
        return { name, brand, imageUrl }
      }).filter(u => u.name && u.brand && u.imageUrl)

      if (updates.length === 0) {
        throw new Error('No valid entries found. Format: name,brand,imageUrl')
      }

      const response = await fetch('/api/admin/bulk-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-images', updates }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update images')
      }

      setUpdateResult(data)
      if (data.updated > 0) {
        setCsvData('')
      }
    } catch (err) {
      setUpdateResult({ updated: 0, failed: 0, errors: [err instanceof Error ? err.message : 'Failed to update'] })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Bulk Operations
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Manage fragrances in bulk
        </p>

        {/* Clear All Images */}
        <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Clear All Bottle Images
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Remove all bottle image URLs from every fragrance. Use this to clear invalid/broken image links.
          </p>

          {result && (
            <div className={`mb-4 p-4 rounded-lg ${
              result.success
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {result.message}
            </div>
          )}

          <button
            onClick={handleClearImages}
            disabled={isClearing}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
          >
            {isClearing ? 'Clearing...' : 'Clear All Images'}
          </button>
        </div>

        {/* Update Images from JSON */}
        <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Update Images from Perfume Database JSON
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Upload the original perfume database JSON file to add images to fragrances that were imported without them.
            This will match by perfume name and brand, and only update fragrances that don&apos;t have an image yet.
          </p>

          {jsonImageResult && (
            <div className={`mb-4 p-4 rounded-lg ${
              jsonImageResult.success
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {jsonImageResult.message}
            </div>
          )}

          <label className={`inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer ${isUpdatingFromJson ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUpdatingFromJson ? 'Updating...' : 'Upload JSON File'}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleUpdateImagesFromJson}
              className="hidden"
              disabled={isUpdatingFromJson}
            />
          </label>
        </div>

        {/* Fix Image URLs */}
        <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Fix Image URLs (Fragrantica)
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Convert image filenames like <code className="bg-gray-100 dark:bg-tonal-30 px-1 rounded">o.37691.jpg</code> to full URLs: <code className="bg-gray-100 dark:bg-tonal-30 px-1 rounded text-xs">https://fimgs.net/images/perfume/o.37691.jpg</code>
          </p>

          {fixUrlResult && (
            <div className={`mb-4 p-4 rounded-lg ${
              fixUrlResult.success
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {fixUrlResult.message}
            </div>
          )}

          <button
            onClick={handleFixImageUrls}
            disabled={isFixingUrls}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {isFixingUrls ? 'Fixing URLs...' : 'Fix Image URLs'}
          </button>
        </div>

        {/* Bulk Update Images */}
        <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Bulk Update Images
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Update bottle images for multiple fragrances using CSV format.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">CSV Format:</p>
            <code className="text-xs text-blue-700 dark:text-blue-300 block">
              name,brand,imageUrl<br/>
              Sauvage,Dior,https://example.com/sauvage.jpg<br/>
              Bleu de Chanel,Chanel,https://example.com/bleu.jpg
            </code>
          </div>

          {updateResult && (
            <div className={`mb-4 p-4 rounded-lg ${
              updateResult.errors.length === 0
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
            }`}>
              <p>Updated: {updateResult.updated} | Failed: {updateResult.failed}</p>
              {updateResult.errors.length > 0 && (
                <ul className="mt-2 text-sm list-disc list-inside">
                  {updateResult.errors.slice(0, 10).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {updateResult.errors.length > 10 && (
                    <li>...and {updateResult.errors.length - 10} more errors</li>
                  )}
                </ul>
              )}
            </div>
          )}

          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            rows={10}
            placeholder="name,brand,imageUrl&#10;Sauvage,Dior,https://..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100 font-mono text-sm mb-4"
          />

          <button
            onClick={handleBulkUpdateImages}
            disabled={isUpdating || !csvData.trim()}
            className="px-6 py-3 bg-primary dark:bg-primary-dm text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update Images'}
          </button>
        </div>
      </div>
    </div>
  )
}
