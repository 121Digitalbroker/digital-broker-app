import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Property from '@/models/Property'; 
import { Calendar, User, Tag, ArrowLeft, MapPin, IndianRupee, ExternalLink, Share2, Bookmark } from 'lucide-react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  await dbConnect();
  const blog = await Blog.findOne({ slug: resolvedParams.slug });

  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: `${blog.title} | Digital Broker`,
    description: blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
    keywords: blog.keywords.join(', '),
    openGraph: {
      title: blog.title,
      description: blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
      images: [{ url: blog.thumbnail || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716' }],
    },
  };
}

export default async function BlogDetail({ params }: BlogPageProps) {
  const resolvedParams = await params;
  await dbConnect();
  
  const blog = await Blog.findOne({ slug: resolvedParams.slug }).lean();

  if (!blog) {
    notFound();
  }

  const relatedProperties = await Property.find({
    _id: { $in: blog.relatedProperties }
  }).lean();

  const hasImage = !!blog.thumbnail;
  const placeholderPropImg = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <article className="min-h-screen bg-[#f8fafc] font-sans overflow-x-hidden">
      <Navbar />
      
      {/* ── INLINE EDITORIAL HEADER ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-4">
        <div className="max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 transition-all mb-4 text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-3">
            {blog.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-500 mt-4">
            <span className="font-medium text-slate-700">{blog.author}</span>
            <span>•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className="text-orange-500 font-medium">{blog.keywords?.[0] || 'Article'}</span>
          </div>

          <div className="border-b border-gray-200 mt-8" />
        </div>
      </div>

      {/* ── CONTENT & SIDEBAR ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            {hasImage && (
              <div className="mb-10 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img 
                  src={blog.thumbnail} 
                  alt={blog.title}
                  className="w-full h-auto object-cover max-h-[500px]"
                />
              </div>
            )}
            <div 
              className="prose prose-lg prose-slate max-w-none 
                prose-headings:font-bold prose-headings:text-[#0a1628]
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-orange-600 prose-a:font-semibold hover:prose-a:text-orange-700
                prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />

            {/* TAGS */}
            {blog.keywords && blog.keywords.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.keywords.map((tag: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200 hover:border-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SHARE */}
            <div className="mt-12 flex items-center justify-between bg-gray-50 p-6 rounded-2xl border border-gray-100">
               <span className="font-bold text-[#0a1628]">Share this article</span>
               <div className="flex gap-3">
                 <button className="p-3 bg-white text-gray-600 rounded-xl hover:text-orange-500 hover:shadow-md transition-all border border-gray-200">
                   <Share2 className="w-5 h-5" />
                 </button>
                 <button className="p-3 bg-white text-gray-600 rounded-xl hover:text-orange-500 hover:shadow-md transition-all border border-gray-200">
                   <Bookmark className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-[380px] shrink-0">
          <div className="sticky top-32 space-y-8">
            
            {/* FEATURED PROPERTIES */}
            {relatedProperties.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-[#0a1628] mb-6 flex items-center gap-2">
                  Featured Properties
                </h3>
                
                <div className="space-y-5">
                  {relatedProperties.map((property: any) => (
                    <Link 
                      key={property._id} 
                      href={`/properties/${property.slug || property._id}`}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={property.images?.[0] || property.mainImage || placeholderPropImg} 
                          alt={property.projectName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-md text-[10px] font-bold text-[#0a1628] shadow-sm">
                          {property.propertyType || 'Residential'}
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-base font-black text-[#0a1628] group-hover:text-orange-600 transition-colors truncate">
                          {property.projectName || property.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mt-2 mb-4">
                          <MapPin className="w-3.5 h-3.5" /> {property.sector}, {property.city}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-1 text-[#0a1628] font-black">
                            <IndianRupee className="w-4 h-4" />
                            <span>{property.price}</span>
                          </div>
                          <div className="text-orange-500">
                            <ExternalLink className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CALL TO ACTION */}
            <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2f4c] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-3">Talk to an Expert</h4>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">Get personalized advice for your real estate investments in Noida.</p>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md">
                  Contact Us
                </button>
              </div>
            </div>
            
          </div>
        </aside>

      </div>
      <Footer />
    </article>
  );
}
