'use client';

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { SearchBar } from "./SearchBar";

interface NavigationProps {
  authStatus?: ReactNode;
}

export default function Navigation({ authStatus }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Go to homepage"
          >
            <span className="text-2xl font-bold text-primary">
              Scentelica
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 justify-center px-8 max-w-2xl">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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
            {authStatus}
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center space-x-4">
            {authStatus}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <div className="mb-4">
                <SearchBar />
              </div>
              <Link
                href="/fragrances"
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Fragrances
              </Link>
              <Link
                href="/brands"
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Brands
              </Link>
              <Link
                href="/notes"
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Notes
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
