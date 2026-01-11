import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Get all fragrances - with fallback for build time
  let fragrances = [];
  try {
    fragrances = await prisma.fragrance.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.log('Database not available during build, sitemap will be generated at runtime');
  }

  const fragranceUrls = fragrances.map((fragrance) => ({
    url: `${baseUrl}/fragrances/${fragrance.id}`,
    lastModified: fragrance.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/fragrances`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...fragranceUrls,
  ];
}
