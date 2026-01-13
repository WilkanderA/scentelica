"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Brand {
  id: string;
  name: string;
}

interface Note {
  id: string;
  name: string;
  category: string;
}

interface FragranceFormProps {
  brands: Brand[];
  notes: Note[];
  initialData?: {
    id: string;
    name: string;
    brandId: string;
    year?: number | null;
    gender?: string | null;
    concentration?: string | null;
    description?: string | null;
    bottleImageUrl?: string | null;
    selectedNotes?: { noteId: string; category: string; intensity?: number }[];
  };
}

export default function FragranceForm({ brands, notes, initialData }: FragranceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brandId: initialData?.brandId || "",
    year: initialData?.year?.toString() || "",
    gender: initialData?.gender || "",
    concentration: initialData?.concentration || "",
    description: initialData?.description || "",
    bottleImageUrl: initialData?.bottleImageUrl || "",
  });

  const [selectedNotes, setSelectedNotes] = useState<{
    noteId: string;
    category: string;
    intensity: number;
  }[]>(initialData?.selectedNotes?.map(n => ({ ...n, intensity: n.intensity || 3 })) || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
        notes: selectedNotes,
      };

      const url = initialData
        ? `/api/admin/fragrances/${initialData.id}`
        : "/api/admin/fragrances";

      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save fragrance");
      }

      const data = await response.json();
      router.push(`/fragrances/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addNote = (noteId: string, category: string) => {
    if (selectedNotes.find(n => n.noteId === noteId)) {
      setSelectedNotes(selectedNotes.filter(n => n.noteId !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, { noteId, category, intensity: 3 }]);
    }
  };

  const updateNoteIntensity = (noteId: string, intensity: number) => {
    setSelectedNotes(selectedNotes.map(n =>
      n.noteId === noteId ? { ...n, intensity } : n
    ));
  };

  const topNotes = notes.filter(n => n.category === "top");
  const heartNotes = notes.filter(n => n.category === "heart");
  const baseNotes = notes.filter(n => n.category === "base");

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Information</h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Fragrance Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
            placeholder="e.g., Bleu de Chanel"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Brand *
          </label>
          <select
            required
            value={formData.brandId}
            onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select a brand</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Year
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
              placeholder="2010"
              min="1900"
              max="2030"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Concentration
            </label>
            <select
              value={formData.concentration}
              onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select</option>
              <option value="Parfum">Parfum</option>
              <option value="EDP">EDP (Eau de Parfum)</option>
              <option value="EDT">EDT (Eau de Toilette)</option>
              <option value="EDC">EDC (Eau de Cologne)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
            rows={4}
            placeholder="Describe the fragrance..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Bottle Image URL
          </label>
          <input
            type="url"
            value={formData.bottleImageUrl}
            onChange={(e) => setFormData({ ...formData, bottleImageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fragrance Notes</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Notes</h3>
            <div className="flex flex-wrap gap-2">
              {topNotes.map(note => {
                const selected = selectedNotes.find(n => n.noteId === note.id);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => addNote(note.id, "top")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selected
                        ? "bg-accent-mint text-gray-900 border-2 border-accent-mint"
                        : "bg-gray-100 dark:bg-tonal-30 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-tonal-50"
                    }`}
                  >
                    {note.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Heart Notes</h3>
            <div className="flex flex-wrap gap-2">
              {heartNotes.map(note => {
                const selected = selectedNotes.find(n => n.noteId === note.id);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => addNote(note.id, "heart")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selected
                        ? "bg-accent-lavender text-gray-900 border-2 border-accent-lavender"
                        : "bg-gray-100 dark:bg-tonal-30 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-tonal-50"
                    }`}
                  >
                    {note.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Base Notes</h3>
            <div className="flex flex-wrap gap-2">
              {baseNotes.map(note => {
                const selected = selectedNotes.find(n => n.noteId === note.id);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => addNote(note.id, "base")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selected
                        ? "bg-accent-rose text-gray-900 border-2 border-accent-rose"
                        : "bg-gray-100 dark:bg-tonal-30 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-tonal-50"
                    }`}
                  >
                    {note.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border-2 border-gray-300 dark:border-tonal-40 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-tonal-30 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary dark:bg-primary-dm text-white rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Fragrance" : "Create Fragrance"}
        </button>
      </div>
    </form>
  );
}
