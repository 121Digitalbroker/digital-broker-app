"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

export default function InteractivePriceBreakup({ resConfigs, comConfigs }: { resConfigs: any[]; comConfigs: any[] }) {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  if (resConfigs.length === 0 && comConfigs.length === 0) return null;

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
              <th className="text-left p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Price/sqft</th>
              <th className="text-left p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Ticket Size</th>
              <th className="text-left p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Loanable</th>
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
                      {c.typology} {hasLayouts && (isExpanded ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
                    </td>
                    <td className="p-4 text-gray-600">{c.unitSize} sqft</td>
                    <td className="p-4 text-gray-600">₹{(c.pricePerSqft || 0).toLocaleString()}</td>
                    <td className="p-4 font-bold text-orange-500">₹{((c.ticketSize || 0) / 10000000).toFixed(1)}Cr</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${c.loanable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {c.loanable ? 'Yes' : 'No'}
                      </span>
                    </td>
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
                      <td colSpan={6} className="p-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {layoutsToRender.map((img: string, idx: number) => (
                            <div key={idx} className="relative group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                              <a href={img} target="_blank" rel="noopener noreferrer" className="block relative aspect-square md:aspect-video w-full">
                                <img src={img} alt={`Floor Plan ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                  <span className="bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Expand
                                  </span>
                                </div>
                              </a>
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
                    <td className="p-4 text-gray-600">₹{(c.pricePerSqft || 0).toLocaleString()}</td>
                    <td className="p-4 font-bold text-orange-500">₹{((c.ticketSize || 0) / 100000).toFixed(0)}L</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${c.loanable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {c.loanable ? 'Yes' : 'No'}
                      </span>
                    </td>
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
                      <td colSpan={6} className="p-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {layoutsToRender.map((img: string, idx: number) => (
                            <div key={idx} className="relative group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                              <a href={img} target="_blank" rel="noopener noreferrer" className="block relative aspect-square md:aspect-video w-full">
                                <img src={img} alt={`Floor Plan ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                  <span className="bg-white text-orange-600 px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Expand
                                  </span>
                                </div>
                              </a>
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
    </div>
  );
}
