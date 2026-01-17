"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Brand {
  id: string;
  name: string;
}

interface FilterSidebarProps {
  brands: Brand[];
}

export default function FilterSidebar({ brands }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [brandSearch, setBrandSearch] = useState("");

  const currentBrand = searchParams.get("brand");
  const currentGender = searchParams.get("gender");
  const currentSort = searchParams.get("sort");

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    // For empty values (like "Highest Rated" which is the default sort),
    // we delete the param to return to default state
    if (!value) {
      params.delete(key);
    } else if (params.get(key) === value) {
      // Toggle off if clicking the same value
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/fragrances?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/fragrances");
  };

  const hasFilters = currentBrand || currentGender || currentSort;

  return (
    <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary dark:text-primary-dm hover:opacity-80 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Sort By</h3>
          <div className="space-y-2">
            {[
              { value: "", label: "Highest Rated" },
              { value: "name", label: "Name" },
              { value: "year", label: "Newest" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter("sort", option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  currentSort === option.value || (!currentSort && !option.value)
                    ? "bg-primary/10 dark:bg-primary-dm/20 text-primary dark:text-primary-dm font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-tonal-30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-tonal-40 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Gender</h3>
          <div className="space-y-2">
            {["Men", "Women", "Unisex"].map((gender) => (
              <button
                key={gender}
                onClick={() => updateFilter("gender", gender)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  currentGender === gender
                    ? "bg-primary/10 dark:bg-primary-dm/20 text-primary dark:text-primary-dm font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-tonal-30"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-tonal-40 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Brand</h3>
          <div className="relative mb-3">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
              placeholder="Search brands..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-tonal-40 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary-dm focus:border-transparent bg-white dark:bg-tonal-30 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {brands
              .filter((brand) =>
                brand.name.toLowerCase().includes(brandSearch.toLowerCase())
              )
              .map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => updateFilter("brand", brand.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                    currentBrand === brand.name
                      ? "bg-primary/10 dark:bg-primary-dm/20 text-primary dark:text-primary-dm font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-tonal-30"
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            {brands.filter((brand) =>
              brand.name.toLowerCase().includes(brandSearch.toLowerCase())
            ).length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                No brands found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
