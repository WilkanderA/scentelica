import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Scentelica
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/fragrances"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Browse
            </Link>
            <Link
              href="/brands"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Brands
            </Link>
            <Link
              href="/notes"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Notes
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
