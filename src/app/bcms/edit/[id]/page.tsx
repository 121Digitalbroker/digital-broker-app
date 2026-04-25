"use client";

import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Eye, Send, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Link2, Image as ImageIcon, Minus, Quote, Undo, Redo, ChevronDown, ChevronRight, Type, Code, Pencil, Save
} from 'lucide-react';

// ── UTILITY COMPONENTS ──
const ToolbarButton = ({ onClick, children, title: ttl }: any) => (
  <button
    type="button"
    title={ttl}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1" />;

const SidebarPanel = ({ label, panelKey, children, openPanels, togglePanel }: { label: string, panelKey: string, children: React.ReactNode, openPanels: any, togglePanel: any }) => (
  <div className="border-b border-gray-200">
    <button
      type="button"
      onClick={() => togglePanel(panelKey)}
      className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {label}
      {openPanels[panelKey] ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
    </button>
    {openPanels[panelKey] && (
      <div className="px-4 pb-4">
        {children}
      </div>
    )}
  </div>
);

// ── MAIN PAGE COMPONENT ──
export default function EditBlog({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [permalink, setPermalink] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');

  const [openPanels, setOpenPanels] = useState<any>({
    labels: true,
    published: true,
    permalink: false,
    options: false,
    thumbnail: false,
    properties: false,
  });

  const [viewMode, setViewMode] = useState<'compose' | 'html'>('compose');
  const htmlRef = useRef<HTMLTextAreaElement>(null);

  // 1. Auth Check
  useEffect(() => {
    const auth = localStorage.getItem('bcms_auth');
    if (auth !== 'true') {
      router.push('/bcms');
    }
  }, [router]);

  // 2. Fetch Blog Data & Properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, propRes] = await Promise.all([
          fetch(`/api/blogs/${id}`),
          fetch('/api/properties')
        ]);

        const blogData = await blogRes.json();
        const propData = await propRes.json();

        if (blogData.success) {
          const blog = blogData.blog;
          setTitle(blog.title);
          setThumbnail(blog.thumbnail || '');
          setKeywords(blog.keywords?.join(', ') || '');
          setAuthor(blog.author);
          setSelectedProperties(blog.relatedProperties || []);
          setPermalink(blog.slug);
          setStatus(blog.status);
          
          if (editorRef.current) {
            editorRef.current.innerHTML = blog.content || '';
          }
        }
        setProperties(Array.isArray(propData) ? propData : (propData.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const togglePanel = (key: string) => {
    setOpenPanels((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleViewMode = () => {
    if (viewMode === 'compose') {
      setViewMode('html');
    } else {
      if (editorRef.current && htmlRef.current) {
        editorRef.current.innerHTML = htmlRef.current.value;
      }
      setViewMode('compose');
    }
  };

  const execCmd = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, []);

  const handleFontSize = (size: string) => execCmd('fontSize', size);
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) execCmd('createLink', url);
  };
  const insertImage = () => {
    const url = prompt('Enter Image URL:');
    if (url) execCmd('insertImage', url);
  };

  const handleUpdate = async (newStatus?: 'Draft' | 'Published') => {
    if (!title.trim()) { alert('Please enter a title'); return; }
    setSaving(true);
    try {
      const content = viewMode === 'compose' ? editorRef.current?.innerHTML : htmlRef.current?.value;
      const dataToSubmit = {
        title,
        content,
        thumbnail,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        author,
        status: newStatus || status,
        relatedProperties: selectedProperties,
        slug: permalink,
      };

      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (res.ok) {
        alert('Article updated successfully!');
        router.push('/bcms');
        router.refresh();
      } else {
        alert('Failed to update article.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col text-left">
      {/* ── TOP NAV ── */}
      <nav className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/bcms" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-400">Editing:</span>
            <span className="text-sm font-black text-[#0a1628] truncate max-w-[200px]">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdate()}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => handleUpdate(status === 'Published' ? 'Draft' : 'Published')}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-colors shadow-lg ${
              status === 'Published' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <Send className="w-4 h-4" />
            {status === 'Published' ? 'Unpublish' : 'Publish Now'}
          </button>
        </div>
      </nav>

      {/* ── TOOLBAR ── */}
      <div className="sticky top-14 z-10 bg-white border-b border-gray-200 px-4 py-1.5 flex items-center gap-0.5 flex-wrap shadow-sm">
        <button
          onClick={toggleViewMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-50 border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-all text-xs font-bold mr-2"
        >
          {viewMode === 'compose' ? <><Code className="w-3.5 h-3.5" /> HTML View</> : <><Pencil className="w-3.5 h-3.5" /> Compose</>}
        </button>
        <Divider />
        
        {viewMode === 'compose' ? (
          <>
            <ToolbarButton onClick={() => execCmd('undo')} ttl="Undo"><Undo className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('redo')} ttl="Redo"><Redo className="w-4 h-4" /></ToolbarButton>
            <Divider />
            <ToolbarButton onClick={() => execCmd('bold')} ttl="Bold"><Bold className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('italic')} ttl="Italic"><Italic className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('underline')} ttl="Underline"><Underline className="w-4 h-4" /></ToolbarButton>
            <Divider />
            <ToolbarButton onClick={() => execCmd('justifyLeft')} ttl="Align Left"><AlignLeft className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('justifyCenter')} ttl="Align Center"><AlignCenter className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('insertUnorderedList')} ttl="Bullet List"><List className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={insertLink} ttl="Insert Link"><Link2 className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={insertImage} ttl="Insert Image"><ImageIcon className="w-4 h-4" /></ToolbarButton>
          </>
        ) : (
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4">Editing Raw HTML Source</p>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-8 py-12">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-4xl font-black text-gray-900 placeholder-gray-300 border-0 border-b-2 border-transparent focus:border-orange-500 focus:ring-0 mb-8 pb-3 bg-transparent transition-colors outline-none"
            />
            
            {viewMode === 'compose' ? (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[60vh] text-gray-800 text-lg leading-relaxed focus:outline-none prose prose-lg max-w-none"
                data-placeholder="Start writing..."
              />
            ) : (
              <textarea
                ref={htmlRef}
                defaultValue={editorRef.current?.innerHTML || ''}
                className="w-full min-h-[60vh] font-mono text-sm text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-200 focus:border-orange-500 outline-none"
              />
            )}
          </div>
        </main>

        <aside className="w-72 border-l border-gray-200 bg-white overflow-y-auto shrink-0 hidden lg:block">
          <SidebarPanel label="Status" panelKey="published" openPanels={openPanels} togglePanel={togglePanel}>
             <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${status === 'Published' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                <span className="text-sm font-bold text-gray-700">{status}</span>
             </div>
          </SidebarPanel>

          <SidebarPanel label="Labels (Keywords)" panelKey="labels" openPanels={openPanels} togglePanel={togglePanel}>
            <p className="text-xs text-gray-400 mb-2">Separate keywords with commas</p>
            <textarea
              placeholder="e.g. luxury flats noida..."
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              rows={3}
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none resize-none"
            />
          </SidebarPanel>

          <SidebarPanel label="Thumbnail" panelKey="thumbnail" openPanels={openPanels} togglePanel={togglePanel}>
            <input
              type="text"
              placeholder="Image URL"
              value={thumbnail}
              onChange={e => setThumbnail(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
            />
            {thumbnail && <img src={thumbnail} className="mt-3 w-full h-24 object-cover rounded-lg" />}
          </SidebarPanel>

          <SidebarPanel label="Permalink" panelKey="permalink" openPanels={openPanels} togglePanel={togglePanel}>
            <input
              type="text"
              value={permalink}
              onChange={e => setPermalink(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
            />
          </SidebarPanel>

          <SidebarPanel label="Properties" panelKey="properties" openPanels={openPanels} togglePanel={togglePanel}>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {properties.map((p: any) => (
                <label key={p._id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(p._id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedProperties(prev => [...prev, p._id]);
                      else setSelectedProperties(prev => prev.filter(id => id !== p._id));
                    }}
                    className="rounded text-orange-500"
                  />
                  <span className="text-xs text-gray-600">{p.projectName || p.title}</span>
                </label>
              ))}
            </div>
          </SidebarPanel>
        </aside>
      </div>

      <style jsx global>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #d1d5db; pointer-events: none; }
      `}</style>
    </div>
  );
}
