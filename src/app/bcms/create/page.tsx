"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Eye, Send, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Link2, Image as ImageIcon, Minus, Quote, Undo, Redo, ChevronDown, ChevronRight, Type, Code, Pencil
} from 'lucide-react';

// ── UTILITY COMPONENTS (DEFINED OUTSIDE TO PREVENT RE-RENDERING FOCUS LOSS) ──

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

export default function CreateBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('Digital Broker Expert');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [permalink, setPermalink] = useState('');

  // Sidebar panels state
  const [openPanels, setOpenPanels] = useState<any>({
    labels: true,
    published: true,
    permalink: false,
    options: false,
    thumbnail: false,
    properties: false,
  });

  const togglePanel = (key: string) => {
    setOpenPanels((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const [viewMode, setViewMode] = useState<'compose' | 'html'>('compose');
  const htmlRef = useRef<HTMLTextAreaElement>(null);

  const toggleViewMode = () => {
    if (viewMode === 'compose') {
      // Sync content from Editor to Textarea
      setKeywords(keywords); // Just to force a stable state
      setViewMode('html');
    } else {
      // Sync content from Textarea to Editor
      if (editorRef.current && htmlRef.current) {
        editorRef.current.innerHTML = htmlRef.current.value;
      }
      setViewMode('compose');
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('bcms_auth');
    if (auth !== 'true') {
      router.push('/bcms');
    }
  }, [router]);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(Array.isArray(data) ? data : (data.data || [])))
      .catch(() => setProperties([]));
  }, []);

  // Generate permalink from title
  useEffect(() => {
    if (title) {
      setPermalink(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title]);

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

  const handleSubmit = async (status: 'Draft' | 'Published') => {
    if (!title.trim()) { alert('Please enter a title'); return; }
    setLoading(true);
    try {
      const content = editorRef.current?.innerHTML || '';
      const dataToSubmit = {
        title,
        content,
        thumbnail,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        author,
        status,
        relatedProperties: selectedProperties,
        slug: permalink,
      };
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Article saved successfully!');
        router.push('/bcms');
        router.refresh();
      } else {
        alert('Error: ' + (result.error || 'Failed to save article. Please try again.'));
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── TOP NAV ── */}
      <nav className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/bcms" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Type className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black text-[#0a1628] tracking-tight hidden sm:block">
              <span className="text-orange-500">B</span>CMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" /> Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('Published')}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </nav>

      {/* ── TOOLBAR ── */}
      <div className="sticky top-14 z-10 bg-white border-b border-gray-200 px-4 py-1.5 flex items-center gap-0.5 flex-wrap shadow-sm">
        <button
          type="button"
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

            <select
              onChange={(e) => handleFontSize(e.target.value)}
              className="text-sm text-gray-600 border-none bg-transparent focus:ring-0 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 h-8"
              defaultValue=""
            >
              <option value="" disabled>Size</option>
              <option value="1">Small</option>
              <option value="3">Normal</option>
              <option value="5">Large</option>
              <option value="7">Huge</option>
            </select>
            <Divider />

            <ToolbarButton onClick={() => execCmd('bold')} ttl="Bold"><Bold className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('italic')} ttl="Italic"><Italic className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('underline')} ttl="Underline"><Underline className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('strikeThrough')} ttl="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolbarButton>
            <Divider />

            <ToolbarButton onClick={() => execCmd('justifyLeft')} ttl="Align Left"><AlignLeft className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('justifyCenter')} ttl="Align Center"><AlignCenter className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('justifyRight')} ttl="Align Right"><AlignRight className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('justifyFull')} ttl="Justify"><AlignJustify className="w-4 h-4" /></ToolbarButton>
            <Divider />

            <ToolbarButton onClick={() => execCmd('insertUnorderedList')} ttl="Bullet List"><List className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('insertOrderedList')} ttl="Numbered List"><ListOrdered className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('formatBlock', 'blockquote')} ttl="Blockquote"><Quote className="w-4 h-4" /></ToolbarButton>
            <Divider />

            <ToolbarButton onClick={insertLink} ttl="Insert Link"><Link2 className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={insertImage} ttl="Insert Image"><ImageIcon className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton onClick={() => execCmd('insertHorizontalRule')} ttl="Horizontal Line"><Minus className="w-4 h-4" /></ToolbarButton>
          </>
        ) : (
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4 italic">HTML Editing Mode Enabled</p>
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
                data-placeholder="Start writing your article..."
                style={{ caretColor: '#f97316' }}
              />
            ) : (
              <textarea
                ref={htmlRef}
                defaultValue={editorRef.current?.innerHTML || ''}
                className="w-full min-h-[60vh] font-mono text-sm text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none leading-relaxed"
                placeholder="Paste your HTML code here..."
              />
            )}
          </div>
        </main>

        <aside className="w-72 border-l border-gray-200 bg-white overflow-y-auto shrink-0 hidden lg:block">
          <SidebarPanel label="Thumbnail" panelKey="thumbnail" openPanels={openPanels} togglePanel={togglePanel}>
            <input
              type="text"
              placeholder="Paste image URL..."
              value={thumbnail}
              onChange={e => setThumbnail(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
            />
            {thumbnail && <img src={thumbnail} alt="thumb" className="mt-3 w-full h-24 object-cover rounded-lg border border-gray-100" />}
          </SidebarPanel>

          <SidebarPanel label="Labels (Keywords)" panelKey="labels" openPanels={openPanels} togglePanel={togglePanel}>
            <p className="text-xs text-gray-400 mb-2">Separate keywords with commas</p>
            <textarea
              placeholder="e.g. luxury flats noida..."
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              rows={3}
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none"
            />
          </SidebarPanel>

          <SidebarPanel label="Published on" panelKey="published" openPanels={openPanels} togglePanel={togglePanel}>
            <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
          </SidebarPanel>

          <SidebarPanel label="Permalink" panelKey="permalink" openPanels={openPanels} togglePanel={togglePanel}>
            <div className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 break-all">
              /blog/<span className="text-orange-600 font-bold">{permalink || 'your-title'}</span>
            </div>
          </SidebarPanel>

          <SidebarPanel label="Link Property" panelKey="properties" openPanels={openPanels} togglePanel={togglePanel}>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {properties.map((p: any) => (
                <label key={p._id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(p._id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedProperties(prev => [...prev, p._id]);
                      else setSelectedProperties(prev => prev.filter(id => id !== p._id));
                    }}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-xs text-gray-600 group-hover:text-gray-900">{p.projectName || p.title}</span>
                </label>
              ))}
            </div>
          </SidebarPanel>

          <SidebarPanel label="Options" panelKey="options" openPanels={openPanels} togglePanel={togglePanel}>
            <label className="block text-xs text-gray-500 font-semibold mb-1">Author (E-E-A-T)</label>
            <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
          </SidebarPanel>
        </aside>
      </div>

      <style jsx global>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #d1d5db; pointer-events: none; }
      `}</style>
    </div>
  );
}
