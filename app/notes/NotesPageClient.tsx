'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Note {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  _count: {
    fragrances: number;
  };
}

interface NotesPageClientProps {
  notes: Note[];
}

export function NotesPageClient({ notes }: NotesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter((note) =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NoteCard = ({ note }: { note: Note }) => (
    <Link
      href={`/notes/${note.id}`}
      className="bg-white dark:bg-tonal-20 border-2 border-gray-200 dark:border-tonal-40 rounded-xl overflow-hidden hover:border-primary dark:hover:border-primary-dm hover:shadow-lg transition-all group block cursor-pointer"
    >
      {note.imageUrl && (
        <div className="relative w-full h-16 bg-gray-100 dark:bg-tonal-30 flex items-center justify-center">
          <Image
            src={note.imageUrl}
            alt={note.name}
            fill
            className="object-contain p-2"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-dm transition-colors mb-2">
          {note.name}
        </h3>
        {note.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{note.description}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Used in {note._count.fragrances} {note._count.fragrances === 1 ? 'fragrance' : 'fragrances'}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Fragrance Notes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Explore the building blocks of perfumery
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-tonal-40 rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery ? `No notes found matching "${searchQuery}"` : "No notes found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
