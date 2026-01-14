import Link from "next/link";
import { NoteForm } from "@/components/admin/NoteForm";

export default function NewNotePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/notes"
          className="inline-flex items-center text-primary dark:text-primary-dm hover:opacity-80 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Notes
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Add New Note
        </h1>

        <NoteForm />
      </div>
    </div>
  );
}
