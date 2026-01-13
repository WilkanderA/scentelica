import Link from "next/link";
import Image from "next/image";

interface FragranceCardProps {
  id: string;
  name: string;
  brand: string;
  gender?: string;
  concentration?: string;
  ratingAvg?: number;
  reviewCount?: number;
  bottleImageUrl?: string;
}

export default function FragranceCard({
  id,
  name,
  brand,
  gender,
  concentration,
  ratingAvg,
  reviewCount,
  bottleImageUrl,
}: FragranceCardProps) {
  return (
    <Link href={`/fragrances/${id}`}>
      <div className="group bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-30 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-tonal-10 dark:to-tonal-30 p-8">
          {bottleImageUrl ? (
            <Image
              src={bottleImageUrl}
              alt={`${name} by ${brand}`}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-32 h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg"></div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-dm transition-colors line-clamp-1">
                {name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{brand}</p>
            </div>
            {ratingAvg && (
              <div className="flex items-center space-x-1 bg-primary/10 px-2 py-1 rounded-full">
                <svg className="w-4 h-4 text-primary fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-sm font-semibold text-primary">
                  {ratingAvg.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-300">
            {gender && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-tonal-30 rounded-full">{gender}</span>
            )}
            {concentration && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-tonal-30 rounded-full">{concentration}</span>
            )}
          </div>

          {reviewCount !== undefined && reviewCount > 0 && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-300">
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
