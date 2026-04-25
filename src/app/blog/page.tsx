import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Real Estate Insights & News | Digital Broker Blog",
  description: "Stay updated with the latest trends in Noida real estate, investment tips, and premium property guides.",
};

export default async function BlogIndex() {
  await dbConnect();
  
  // Only show published blogs to the public
  const blogs = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="bg-[#0a1628] pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Real Estate <span className="text-orange-500">Insights</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Expert guides, market trends, and investment opportunities in Noida & Greater Noida.
          </p>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-400">Our first insights are coming soon!</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog: any) => (
              <Link 
                key={blog._id} 
                href={`/blog/${blog.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 p-8 md:p-10"
              >
                <div className="flex items-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest mb-5">
                  <span className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                    <User className="w-3.5 h-3.5" />
                    {blog.author || 'Expert'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                  {blog.title}
                </h2>

                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                  {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 180)}...
                </p>

                <div className="mt-auto flex items-center text-orange-600 font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      
      {/* NEWSLETTER / CTA */}
      <section className="bg-orange-50 py-20 px-6 mt-10">
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] p-10 md:p-16 border border-orange-100 shadow-xl shadow-orange-500/5 text-center">
          <h3 className="text-3xl md:text-4xl font-black text-[#0a1628] mb-4">Never Miss an Opportunity</h3>
          <p className="text-gray-500 font-medium mb-10">Get the latest property price trends and investment guides delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-medium"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-orange-500/20">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
