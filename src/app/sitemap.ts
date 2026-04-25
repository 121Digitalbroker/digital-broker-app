import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import Blog from '@/models/Blog';

const DOMAIN = 'https://digitalbroker.in'; // Replace with actual domain if different

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/search',
    '/yamuna-expressway',
    '/blog',
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

  let dynamicPages: any[] = [];
  try {
    await dbConnect();
    
    // Properties
    const properties = await Property.find({ isVisible: true }).select('_id updatedAt slug').lean();
    const propertyPages = properties.map((prop: any) => ({
      url: `${DOMAIN}/properties/${prop.slug || prop._id}`,
      lastModified: prop.updatedAt || new Date(),
      changeFrequency: 'weekly' as any,
      priority: 0.6,
    }));

    // Blogs
    const blogs = await Blog.find({ status: 'Published' }).select('slug updatedAt').lean();
    const blogPages = blogs.map((blog: any) => ({
      url: `${DOMAIN}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
      changeFrequency: 'weekly' as any,
      priority: 0.7,
    }));

    dynamicPages = [...propertyPages, ...blogPages];
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error);
  }

  return [...staticPages, ...dynamicPages];
}
