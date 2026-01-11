interface Retailer {
  id: string;
  name: string;
  websiteUrl: string;
}

interface RetailerLink {
  id: string;
  productUrl: string;
  price?: number;
  currency?: string;
  retailer: Retailer;
}

interface RetailerLinksProps {
  retailers: RetailerLink[];
}

export default function RetailerLinks({ retailers }: RetailerLinksProps) {
  if (retailers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Where to Buy</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {retailers.map((link) => (
          <a
            key={link.id}
            href={link.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {link.retailer.name}
              </p>
              {link.price && link.currency && (
                <p className="text-sm text-gray-600 mt-1">
                  {link.currency === 'USD' ? '$' : link.currency}
                  {link.price.toFixed(2)}
                </p>
              )}
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
