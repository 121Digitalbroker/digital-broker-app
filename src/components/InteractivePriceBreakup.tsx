"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InteractivePriceBreakup({ resConfigs, comConfigs }: { resConfigs: any[]; comConfigs: any[] }) {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<{ url: string; allImages: string[]; currentIndex: number } | null>(null);

  if (resConfigs.length === 0 && comConfigs.length === 0) return null;

  const openOverlay = (url: string, allImages: string[]) => {
    const currentIndex = allImages.indexOf(url);
    setOverlayImage({ url, allImages, currentIndex });
  };

  const closeOverlay = () => {
    setOverlayImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!overlayImage) return;
    const newIndex = direction === 'prev'
      ? (overlayImage.currentIndex - 1 + overlayImage.allImages.length) % overlayImage.allImages.length
      : (overlayImage.currentIndex + 1) % overlayImage.allImages.length;
    setOverlayImage({
      url: overlayImage.allImages[newIndex],
      allImages: overlayImage.allImages,
      currentIndex: newIndex
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!overlayImage) return;

      if (e.key === 'Escape') {
        closeOverlay();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [overlayImage]);

  const toggleRow = (id: string, layoutImages: any[]) => {
    // Only toggle if there are layout images or we want them to expand anyway text-wise
    if (expandedIndex === id) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(id);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-[#0a1628] mb-6 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
        Price Breakup & Floor Plans
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 rounded-xl">
              <th className="text-left p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider rounded-l-xl">Type</th>
              <th className="text-left p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Unit Size</th>
              <th className="text-left p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider rounded-r-xl">Layouts</th>
            </tr>
          </thead>
          <tbody>
            {resConfigs.map((c: any, i: number) => {
              const id = `res-${i}`;
              const isExpanded = expandedIndex === id;
              const layoutsToRender = (c.layoutImages && c.layoutImages.length > 0) ? c.layoutImages : (c.sitePlanUrl ? [c.sitePlanUrl] : []);
              const hasLayouts = layoutsToRender.length > 0;

              return (
                <React.Fragment key={id}>
                  <tr
                    onClick={() => hasLayouts && toggleRow(id, layoutsToRender)}
                    className={`border-b border-gray-50 transition-colors ${hasLayouts ? 'cursor-pointer hover:bg-orange-50/30' : ''}`}
                  >
                    <td className="p-4 font-bold text-[#0a1628] flex items-center gap-2">
                      {(() => {
                        const typology = String(c.typology || '');
                        const servantRooms = Number(c.servantRooms) || 0;
                        if (typology && servantRooms >= 1) {
                          return `${typology} + ${servantRooms === 1 ? 'S' : servantRooms + 'S'}`;
                        }
                        return typology;
                      })()} 
                      {hasLayouts && (isExpanded ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
                    </td>
                    <td className="p-4 text-gray-600">{c.unitSize} sqft</td>
                    <td className="p-4">
                      {hasLayouts ? (
                        <div className="flex items-center gap-1.5 text-orange-500 font-bold text-[10px] uppercase">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>View {layoutsToRender.length} Plans</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-bold uppercase">N/A</span>
                      )}
                    </td>
                  </tr>

                  {isExpanded && hasLayouts && (
                    <tr className="bg-orange-50/30">
                      <td colSpan={3} className="p-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {layoutsToRender.map((img: string, idx: number) => (
                            <div key={idx} className="relative group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 cursor-pointer" onClick={() => openOverlay(img, layoutsToRender)}>
                              <div className="block relative aspect-square md:aspect-video w-full">
                                <img src={img} alt={`Floor Plan ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                  <span className="bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Expand
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {/* Commercial Configs (Layouts approach might be the same if we add it later) */}
            {comConfigs.map((c: any, i: number) => {
              const id = `com-${i}`;
              const isExpanded = expandedIndex === id;
              const layoutsToRender = (c.layoutImages && c.layoutImages.length > 0) ? c.layoutImages : (c.sitePlanUrl ? [c.sitePlanUrl] : []);
              const hasLayouts = layoutsToRender.length > 0;

              return (
                <React.Fragment key={id}>
                  <tr
                    onClick={() => hasLayouts && toggleRow(id, layoutsToRender)}
                    className={`border-b border-gray-50 transition-colors ${hasLayouts ? 'cursor-pointer hover:bg-orange-50/30' : ''}`}
                  >
                    <td className="p-4 font-bold text-[#0a1628] flex items-center gap-2">
                      {c.commercialType} {hasLayouts && (isExpanded ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
                    </td>
                    <td className="p-4 text-gray-600">{c.unitSize} sqft</td>
                    <td className="p-4">
                      {hasLayouts ? (
                        <div className="flex items-center gap-1.5 text-orange-500 font-bold text-[10px] uppercase">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>View {layoutsToRender.length} Plans</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-bold uppercase">N/A</span>
                      )}
                    </td>
                  </tr>

                  {isExpanded && hasLayouts && (
                    <tr className="bg-orange-50/30">
                      <td colSpan={3} className="p-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {layoutsToRender.map((img: string, idx: number) => (
                            <div key={idx} className="relative group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 cursor-pointer" onClick={() => openOverlay(img, layoutsToRender)}>
                              <div className="block relative aspect-square md:aspect-video w-full">
                                <img src={img} alt={`Floor Plan ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                  <span className="bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Expand
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Image Overlay/Modal */}
      {overlayImage && (
        <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4" onClick={closeOverlay}>
          <div className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeOverlay}
              className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors p-2"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {overlayImage.allImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-500 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-3"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-500 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-3"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={overlayImage.url}
              alt={`Floor Plan ${overlayImage.currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            {/* Image Counter */}
            {overlayImage.allImages.length > 1 && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-sm font-bold">
                {overlayImage.currentIndex + 1} / {overlayImage.allImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
