"use client";

import { useState, useRef, useEffect } from "react";
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
    selectedNotes?: { noteId: string; noteName: string; category: string; intensity?: number }[];
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
  }[]>(initialData?.selectedNotes?.map(n => ({ noteId: n.noteId, category: n.category, intensity: n.intensity || 3 })) || []);

  const [customNotes, setCustomNotes] = useState<{
    top: string[];
    heart: string[];
    base: string[];
  }>(() => {
    if (initialData?.selectedNotes) {
      const topNotes = initialData.selectedNotes.filter(n => n.category === 'top').map(n => n.noteName);
      const heartNotes = initialData.selectedNotes.filter(n => n.category === 'heart').map(n => n.noteName);
      const baseNotes = initialData.selectedNotes.filter(n => n.category === 'base').map(n => n.noteName);
      return {
        top: topNotes,
        heart: heartNotes,
        base: baseNotes
      };
    }
    return {
      top: [],
      heart: [],
      base: []
    };
  });

  const [noteInputs, setNoteInputs] = useState<{
    top: string;
    heart: string;
    base: string;
  }>({
    top: '',
    heart: '',
    base: ''
  });

  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState<{
    top: boolean;
    heart: boolean;
    base: boolean;
  }>({ top: false, heart: false, base: false });

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<{
    top: number;
    heart: number;
    base: number;
  }>({ top: -1, heart: -1, base: -1 });

  // Refs for click-outside detection
  const topInputRef = useRef<HTMLDivElement>(null);
  const heartInputRef = useRef<HTMLDivElement>(null);
  const baseInputRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Collect all custom note names
      const allCustomNotes = [
        ...customNotes.top.map(name => ({ name, category: 'top' })),
        ...customNotes.heart.map(name => ({ name, category: 'heart' })),
        ...customNotes.base.map(name => ({ name, category: 'base' }))
      ];

      const payload = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
        notes: selectedNotes,
        customNotes: allCustomNotes,
        newBrandName: showNewBrandInput ? newBrandName.trim() : null
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

  const addCustomNote = (category: 'top' | 'heart' | 'base') => {
    const input = noteInputs[category].trim();
    if (input && !customNotes[category].includes(input)) {
      setCustomNotes({
        ...customNotes,
        [category]: [...customNotes[category], input]
      });
      setNoteInputs({
        ...noteInputs,
        [category]: ''
      });
    }
  };

  const removeCustomNote = (category: 'top' | 'heart' | 'base', noteName: string) => {
    setCustomNotes({
      ...customNotes,
      [category]: customNotes[category].filter(n => n !== noteName)
    });
  };

  // Get filtered suggestions for a category
  const getSuggestions = (category: 'top' | 'heart' | 'base') => {
    const input = noteInputs[category].toLowerCase().trim();
    if (!input) return [];

    return notes
      .filter(note =>
        note.name.toLowerCase().includes(input) &&
        !customNotes[category].includes(note.name)
      )
      .slice(0, 10); // Limit to 10 suggestions
  };

  // Handle input change with autocomplete
  const handleNoteInputChange = (category: 'top' | 'heart' | 'base', value: string) => {
    setNoteInputs({ ...noteInputs, [category]: value });
    setShowSuggestions({ ...showSuggestions, [category]: value.trim().length > 0 });
    setActiveSuggestionIndex({ ...activeSuggestionIndex, [category]: -1 });
  };

  // Select a suggestion
  const selectSuggestion = (category: 'top' | 'heart' | 'base', noteName: string) => {
    if (!customNotes[category].includes(noteName)) {
      setCustomNotes({
        ...customNotes,
        [category]: [...customNotes[category], noteName]
      });
    }
    setNoteInputs({ ...noteInputs, [category]: '' });
    setShowSuggestions({ ...showSuggestions, [category]: false });
    setActiveSuggestionIndex({ ...activeSuggestionIndex, [category]: -1 });
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent, category: 'top' | 'heart' | 'base') => {
    const suggestions = getSuggestions(category);
    const activeIndex = activeSuggestionIndex[category];

    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        selectSuggestion(category, suggestions[activeIndex].name);
      } else {
        addCustomNote(category);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveSuggestionIndex({
          ...activeSuggestionIndex,
          [category]: Math.min(activeIndex + 1, suggestions.length - 1)
        });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex({
        ...activeSuggestionIndex,
        [category]: Math.max(activeIndex - 1, -1)
      });
    } else if (e.key === 'Escape') {
      setShowSuggestions({ ...showSuggestions, [category]: false });
      setActiveSuggestionIndex({ ...activeSuggestionIndex, [category]: -1 });
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topInputRef.current && !topInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(prev => ({ ...prev, top: false }));
      }
      if (heartInputRef.current && !heartInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(prev => ({ ...prev, heart: false }));
      }
      if (baseInputRef.current && !baseInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(prev => ({ ...prev, base: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {!showNewBrandInput ? (
            <div className="flex gap-2">
              <select
                required
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select a brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewBrandInput(true)}
                className="px-4 py-2 border-2 border-primary dark:border-primary-dm text-primary dark:text-primary-dm rounded-lg hover:bg-primary dark:hover:bg-primary-dm hover:text-white transition-colors font-medium whitespace-nowrap"
              >
                + New Brand
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Enter brand name"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowNewBrandInput(false);
                    setNewBrandName('');
                  }}
                  className="px-4 py-2 border-2 border-gray-300 dark:border-tonal-40 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-tonal-30 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This will create a new brand automatically when you save the fragrance
              </p>
            </div>
          )}
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
              <option value="">Select concentration</option>
              <option value="Splash">Splash/Aftershave</option>
              <option value="Eau Fraiche">Eau Fraiche</option>
              <option value="EDC">Eau de Cologne</option>
              <option value="EDT">Eau de Toilette</option>
              <option value="EDT Intense">Eau de Toilette Intense</option>
              <option value="EDP">Eau de Parfum</option>
              <option value="EDP Intense">Eau de Parfum Intense</option>
              <option value="Elixir">Elixir</option>
              <option value="Essence">Essence</option>
              <option value="Absolu">Absolu</option>
              <option value="Extrait de Parfum">Extrait de Parfum</option>
              <option value="Parfum">Parfum</option>
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
        <p className="text-sm text-gray-600 dark:text-gray-400">Add notes by typing their names and pressing Enter or clicking Add</p>

        <div className="space-y-6">
          {/* Top Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Notes</h3>
            <div className="flex gap-2 mb-3">
              <div ref={topInputRef} className="flex-1 relative">
                <input
                  type="text"
                  value={noteInputs.top}
                  onChange={(e) => handleNoteInputChange('top', e.target.value)}
                  onKeyDown={(e) => handleNoteKeyDown(e, 'top')}
                  onFocus={() => noteInputs.top && setShowSuggestions({ ...showSuggestions, top: true })}
                  placeholder="e.g., Bergamot, Lemon, Mint"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
                />
                {showSuggestions.top && getSuggestions('top').length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-tonal-30 border border-gray-300 dark:border-tonal-40 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {getSuggestions('top').map((note, index) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => selectSuggestion('top', note.name)}
                        className={`w-full px-4 py-2 text-left hover:bg-accent-mint/20 dark:hover:bg-accent-mint/30 transition-colors ${
                          index === activeSuggestionIndex.top
                            ? 'bg-accent-mint/30 dark:bg-accent-mint/40'
                            : ''
                        }`}
                      >
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{note.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => addCustomNote('top')}
                className="px-6 py-2 bg-accent-mint text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            {customNotes.top.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customNotes.top.map((noteName, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-accent-mint/30 dark:bg-accent-mint/40 text-gray-900 dark:text-gray-100 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {noteName}
                    <button
                      type="button"
                      onClick={() => removeCustomNote('top', noteName)}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Heart Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Heart Notes</h3>
            <div className="flex gap-2 mb-3">
              <div ref={heartInputRef} className="flex-1 relative">
                <input
                  type="text"
                  value={noteInputs.heart}
                  onChange={(e) => handleNoteInputChange('heart', e.target.value)}
                  onKeyDown={(e) => handleNoteKeyDown(e, 'heart')}
                  onFocus={() => noteInputs.heart && setShowSuggestions({ ...showSuggestions, heart: true })}
                  placeholder="e.g., Rose, Jasmine, Lavender"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
                />
                {showSuggestions.heart && getSuggestions('heart').length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-tonal-30 border border-gray-300 dark:border-tonal-40 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {getSuggestions('heart').map((note, index) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => selectSuggestion('heart', note.name)}
                        className={`w-full px-4 py-2 text-left hover:bg-accent-lavender/20 dark:hover:bg-accent-lavender/30 transition-colors ${
                          index === activeSuggestionIndex.heart
                            ? 'bg-accent-lavender/30 dark:bg-accent-lavender/40'
                            : ''
                        }`}
                      >
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{note.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => addCustomNote('heart')}
                className="px-6 py-2 bg-accent-lavender text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            {customNotes.heart.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customNotes.heart.map((noteName, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-accent-lavender/30 dark:bg-accent-lavender/40 text-gray-900 dark:text-gray-100 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {noteName}
                    <button
                      type="button"
                      onClick={() => removeCustomNote('heart', noteName)}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Base Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Base Notes</h3>
            <div className="flex gap-2 mb-3">
              <div ref={baseInputRef} className="flex-1 relative">
                <input
                  type="text"
                  value={noteInputs.base}
                  onChange={(e) => handleNoteInputChange('base', e.target.value)}
                  onKeyDown={(e) => handleNoteKeyDown(e, 'base')}
                  onFocus={() => noteInputs.base && setShowSuggestions({ ...showSuggestions, base: true })}
                  placeholder="e.g., Vanilla, Sandalwood, Musk"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
                />
                {showSuggestions.base && getSuggestions('base').length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-tonal-30 border border-gray-300 dark:border-tonal-40 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {getSuggestions('base').map((note, index) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => selectSuggestion('base', note.name)}
                        className={`w-full px-4 py-2 text-left hover:bg-accent-rose/20 dark:hover:bg-accent-rose/30 transition-colors ${
                          index === activeSuggestionIndex.base
                            ? 'bg-accent-rose/30 dark:bg-accent-rose/40'
                            : ''
                        }`}
                      >
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{note.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => addCustomNote('base')}
                className="px-6 py-2 bg-accent-rose text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            {customNotes.base.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customNotes.base.map((noteName, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-accent-rose/30 dark:bg-accent-rose/40 text-gray-900 dark:text-gray-100 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {noteName}
                    <button
                      type="button"
                      onClick={() => removeCustomNote('base', noteName)}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          className="px-6 py-3 bg-primary dark:bg-primary-dm text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Fragrance" : "Create Fragrance"}
        </button>
      </div>
    </form>
  );
}
