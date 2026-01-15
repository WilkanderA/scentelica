import { BulkImportForm } from "@/components/admin/BulkImportForm";

export default function BulkImportPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bulk Import Fragrances
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Import multiple fragrances at once using JSON format
          </p>
        </div>

        <BulkImportForm />
      </div>
    </div>
  );
}
