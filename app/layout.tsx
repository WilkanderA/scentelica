import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scentelica - Discover Your Perfect Fragrance",
  description: "A modern fragrance discovery platform. Explore top perfumes, read reviews, and find where to buy your favorite scents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-secondary text-secondary-foreground py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              © 2026 Scentelica. Discover your signature scent.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
