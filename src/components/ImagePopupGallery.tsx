"use client";
import React, { useState } from 'react';
import { Heart, Share2, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImagePopupGalleryProps {
  images: string[];
  title: string;
  status: string;
}

const ImagePopupGallery = ({ images, title, status }: ImagePopupGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const openLightbox = (idx: number) => {
    setCurrentIdx(idx);
    setLightboxOpen(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const heroImage = images[0];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          onClick={() => openLightbox(0)}
          className="lg:col-span-2 h-[450px] relative group cursor-pointer overflow-hidden rounded-[2.5rem]"
        >
          <img src={heroImage} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:bg-black/10 transition-colors" />
          <div className="absolute top-6 left-6 bg-orange-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{status}</div>
          <div className="absolute bottom-6 left-6 flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-2xl transition-all border border-white/20">
              <Heart className="w-5 h-5" />
            </button>
            <button className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-2xl transition-all border border-white/20">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-black/50 backdrop-blur-md text-white p-4 rounded-full">
              <Maximize2 className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6 h-[450px]">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              onClick={() => images[i] && openLightbox(i)}
              className="flex-1 relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-gray-100"
            >
              {images[i] && (
                <img src={images[i]} alt={`${title} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              )}
              {i === 2 && images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors flex items-center justify-center">
                  <span className="text-white font-black text-xl">+{images.length - 3}</span>
                </div>
              )}
              {images[i] && i !== 2 && (
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/20">
                    <Maximize2 className="w-6 h-6 text-white" />
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center" onClick={closeLightbox}>
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors bg-white/10 p-3 rounded-full hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all bg-white/10 p-4 rounded-full hover:bg-white/20 hover:scale-110 hover:-translate-x-1"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <img 
            src={images[currentIdx]} 
            alt={`${title} ${currentIdx + 1}`} 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          />

          <button 
            onClick={nextImage}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all bg-white/10 p-4 rounded-full hover:bg-white/20 hover:scale-110 hover:translate-x-1"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-bold tracking-widest text-sm bg-black/50 px-6 py-2 rounded-full">
            {currentIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePopupGallery;
