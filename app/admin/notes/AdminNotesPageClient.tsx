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

interface AdminNotesPageClientProps {
  notes: Note[];
}

export function AdminNotesPageClient({ notes }: AdminNotesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter((note) =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {notes.length} notes in the database
            </p>
          </div>
          <Link
            href="/admin/notes/new"
            className="px-6 py-3 bg-primary dark:bg-primary-dm text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium"
          >
            Add New Note
          </Link>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredNotes.map((note) => (
              <Link
                key={note.id}
                href={`/admin/notes/${note.id}/edit`}
                className="bg-white dark:bg-tonal-20 border border-gray-200 dark:border-tonal-40 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
              >
                <div className="relative w-12 h-12 mb-3">
                  {note.imageUrl ? (
                    <Image
                      src={note.imageUrl}
                      alt={note.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-tonal-30 rounded-lg">
                      <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {note.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {searchQuery ? `No notes found matching "${searchQuery}"` : "No notes found. Add your first note to get started."}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/notes/new"
                className="inline-block px-6 py-3 bg-primary dark:bg-primary-dm text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Add New Note
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
