"use client";
import React from 'react';

const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 flex flex-col h-full shadow-sm relative overflow-hidden">
      {/* 1. Phantom Image Section */}
      <div className="relative h-[220px] bg-gray-100 rounded-[2.2rem] mb-5 overflow-hidden animate-phantom">
        {/* Shimmer is handled by CSS ::after class animate-phantom */}
      </div>

      <div className="px-2 flex flex-col flex-1 pb-2">
        {/* 2. Developer Header Line (Phantom) */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-4 w-20 bg-gray-200 rounded-full animate-phantom-pulse" /> {/* Developer Badge */}
          <div className="h-7 w-36 bg-gray-100 rounded-xl animate-phantom-pulse shadow-sm" /> {/* Name */}
        </div>

        {/* 3. Project Name (Small Subtitle Phantom) */}
        <div className="h-3.5 w-48 bg-gray-50 rounded-lg mb-6 animate-phantom-pulse" />

        {/* 4. RERA Badge Phantom */}
        <div className="h-7 w-32 bg-gray-50 rounded-lg mb-6 border border-gray-100 animate-phantom-pulse" />

        {/* 5. Stats Grid (Ticket Size & Business Status) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="h-16 bg-gray-50/80 rounded-2xl border border-gray-100 flex flex-col justify-center px-4 gap-2">
            <div className="h-2 w-12 bg-gray-200 rounded-full" />
            <div className="h-4 w-16 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-16 bg-gray-50/80 rounded-2xl border border-gray-100 flex flex-col justify-center px-4 gap-2">
            <div className="h-2 w-12 bg-gray-200 rounded-full" />
            <div className="h-4 w-20 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* 6. Location & Badges */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="h-3 w-40 bg-gray-100 rounded-full animate-phantom-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-blue-50 rounded-full border border-blue-100" />
            <div className="h-6 w-20 bg-orange-50 rounded-full border border-orange-100" />
          </div>
        </div>

        {/* 7. Footer (Action Buttons Phantom) */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="h-3 w-20 bg-gray-100 rounded-md" />
            <div className="h-2 w-16 bg-gray-50 rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-2xl border border-gray-100 animate-phantom-pulse" />
            <div className="w-10 h-10 bg-gray-100 rounded-2xl border border-gray-100 animate-phantom-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
