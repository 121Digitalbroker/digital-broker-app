"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, PlusCircle, Settings, LogOut, CheckCircle, Clock, Shield } from 'lucide-react';

export default function BCMSDashboard() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('bcms_auth');
    if (auth === 'true') {
      setIsAuthorized(true);
      fetchBlogs();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success && (data.role === 'bcms_editor' || data.role === 'superadmin')) {
        localStorage.setItem('bcms_auth', 'true');
        localStorage.setItem('bcms_role', data.role);
        setIsAuthorized(true);
        fetchBlogs();
      } else {
        alert(data.error || 'You do not have access to the Blog CMS');
      }
    } catch (err) {
      alert('Login error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bcms_auth');
    localStorage.removeItem('bcms_role');
    setIsAuthorized(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 text-left">
            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
               <span className="text-orange-500 text-4xl">B</span>CMS Login
            </h1>
            <p className="text-blue-200 mb-8 text-sm font-medium">Digital Broker Content Management</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-orange-500 transition-all font-medium"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-orange-500 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-500/20 mt-4 active:scale-95">
                Sign In to Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const publishedCount = blogs.filter((b: any) => b.status === 'Published').length;
  const draftCount = blogs.filter((b: any) => b.status === 'Draft').length;

  return (
    <div className="min-h-screen bg-gray-50 flex text-left">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a1628] text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="text-orange-500">B</span>CMS
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide uppercase">Digital Broker Blogs</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/bcms" className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl font-bold">
            <FileText className="w-5 h-5" /> All Articles
          </Link>
          <Link href="/bcms/create" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-bold transition-colors">
            <PlusCircle className="w-5 h-5" /> Write New
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-bold transition-colors">
            <Settings className="w-5 h-5" /> Main Admin
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#0a1628]">Content Dashboard</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your Google Discover optimized articles.</p>
          </div>
          <Link href="/bcms/create" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95">
            <PlusCircle className="w-5 h-5" /> Write Article
          </Link>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Articles</p>
                  <p className="text-2xl font-black text-[#0a1628]">{blogs.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Published</p>
                  <p className="text-2xl font-black text-[#0a1628]">{publishedCount}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Drafts</p>
                  <p className="text-2xl font-black text-[#0a1628]">{draftCount}</p>
                </div>
              </div>
            </div>

            {/* ARTICLES LIST */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-black text-[#0a1628]">Recent Articles</h3>
              </div>
              {blogs.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-gray-300" />
                  </div>
                  <h4 className="text-lg font-bold text-[#0a1628] mb-1">No articles found</h4>
                  <p className="text-sm text-gray-500 mb-6">Start writing high-quality content to rank on Google.</p>
                  <Link href="/bcms/create" className="text-orange-500 font-bold uppercase tracking-widest text-xs border border-orange-200 px-6 py-2.5 rounded-full hover:bg-orange-50 transition-colors">
                    Create First Article
                  </Link>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500">
                      <th className="p-4 font-black">Title</th>
                      <th className="p-4 font-black">Status</th>
                      <th className="p-4 font-black">Date</th>
                      <th className="p-4 font-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog: any) => (
                      <tr key={blog._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-[#0a1628] text-sm">{blog.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-xs">{blog.slug}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            blog.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-500 font-medium">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <Link href={`/bcms/edit/${blog._id}`} className="text-blue-600 hover:text-blue-800 text-xs font-bold">Edit</Link>
                          <a href={`/blog/${blog.slug}`} target="_blank" className="text-gray-400 hover:text-gray-600 text-xs font-bold">View</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
