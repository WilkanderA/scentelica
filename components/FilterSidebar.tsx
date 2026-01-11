"use client";

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

  const currentBrand = searchParams.get("brand");
  const currentGender = searchParams.get("gender");
  const currentSort = searchParams.get("sort");

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (params.get(key) === value) {
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
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
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Gender</h3>
          <div className="space-y-2">
            {["Men", "Women", "Unisex"].map((gender) => (
              <button
                key={gender}
                onClick={() => updateFilter("gender", gender)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  currentGender === gender
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => updateFilter("brand", brand.name)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  currentBrand === brand.name
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
