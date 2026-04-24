import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

const DOMAIN = 'https://digitalbroker.in'; // Replace with actual domain if different

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/search',
    '/yamuna-expressway',
    '/about',
    '/support',
    '/contact',
    '/careers',
  ].map((route) => ({
    url: `${DOMAIN}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as any,
    priority: route === '' ? 1 : 0.8,
  }));

  let propertyPages: any[] = [];
  try {
    await dbConnect();
    const properties = await Property.find({ isVisible: true }).select('_id updatedAt').lean();

    propertyPages = properties.map((prop: any) => ({
      url: `${DOMAIN}/properties/${prop._id}`,
      lastModified: prop.updatedAt || new Date(),
      changeFrequency: 'weekly' as any,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
  }

  return [...staticPages, ...propertyPages];
}
