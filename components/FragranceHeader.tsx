import Image from "next/image";

interface FragranceHeaderProps {
  name: string;
  brand: string;
  year?: number;
  gender?: string;
  concentration?: string;
  ratingAvg?: number;
  reviewCount: number;
  bottleImageUrl?: string;
  description?: string;
}

export default function FragranceHeader({
  name,
  brand,
  year,
  gender,
  concentration,
  ratingAvg,
  reviewCount,
  bottleImageUrl,
  description,
}: FragranceHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-accent-lavender/10 to-accent-rose/5 -mt-6">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square bg-white rounded-2xl shadow-xl p-12">
            {bottleImageUrl ? (
              <Image
                src={bottleImageUrl}
                alt={`${name} by ${brand}`}
                fill
                className="object-contain p-8"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-48 h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl"></div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {name}
              </h1>
              <p className="text-2xl text-gray-600 font-medium">{brand}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {gender && (
                <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                  {gender}
                </span>
              )}
              {concentration && (
                <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                  {concentration}
                </span>
              )}
              {year && (
                <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                  {year}
                </span>
              )}
            </div>

            {ratingAvg && (
              <div className="flex items-center space-x-4 py-4">
                <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                  <svg className="w-6 h-6 text-primary fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-2xl font-bold text-primary">
                    {ratingAvg.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600">
                  {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            )}

            {description && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
