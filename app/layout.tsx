import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Scentelica - Discover Your Perfect Fragrance",
    template: "%s | Scentelica",
  },
  description: "A modern fragrance discovery platform. Explore top perfumes, read reviews, and find where to buy your favorite scents.",
  keywords: ["perfume", "fragrance", "cologne", "scent", "perfume reviews", "fragrance notes", "where to buy perfume"],
  authors: [{ name: "Scentelica" }],
  openGraph: {
    title: "Scentelica - Discover Your Perfect Fragrance",
    description: "A modern fragrance discovery platform. Explore top perfumes, read reviews, and find where to buy your favorite scents.",
    type: "website",
    locale: "en_US",
    siteName: "Scentelica",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scentelica - Discover Your Perfect Fragrance",
    description: "A modern fragrance discovery platform. Explore top perfumes, read reviews, and find where to buy your favorite scents.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-surface-10 text-gray-900 dark:text-surface-60 transition-colors duration-200`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation authStatus={<AuthStatus />} />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-secondary dark:bg-tonal-10 text-white py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm">
                © 2026 Scentelica. Discover your signature scent.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
