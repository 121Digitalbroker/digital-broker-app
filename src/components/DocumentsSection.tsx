"use client";

import React, { useState } from 'react';
import { FileText, DollarSign, Navigation, Layers, Download } from 'lucide-react';
import DocumentDownloadLead from './DocumentDownloadLead';

interface DocumentsSectionProps {
  propertyId: string;
  propertyTitle: string;
  brochureUrl: string | null;
  priceListUrl: string | null;
  sitePlanUrl: string | null;
  layoutPlanUrl: string | null;
}

export default function DocumentsSection({
  propertyId,
  propertyTitle,
  brochureUrl,
  priceListUrl,
  sitePlanUrl,
  layoutPlanUrl
}: DocumentsSectionProps) {
  const [activeDownload, setActiveDownload] = useState<{
    isOpen: boolean;
    documentType: string;
    documentUrl: string | null;
  }>({ isOpen: false, documentType: '', documentUrl: null });

  const documents = [
    { label: 'Brochure', url: brochureUrl, icon: FileText, bgClass: 'bg-orange-100', textClass: 'text-orange-500', btnClass: 'bg-orange-500 hover:bg-orange-600' },
    { label: 'Price List', url: priceListUrl, icon: DollarSign, bgClass: 'bg-green-100', textClass: 'text-green-500', btnClass: 'bg-green-500 hover:bg-green-600' },
    { label: 'Site Plan', url: sitePlanUrl, icon: Navigation, bgClass: 'bg-blue-100', textClass: 'text-blue-500', btnClass: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Layout Plan', url: layoutPlanUrl, icon: Layers, bgClass: 'bg-purple-100', textClass: 'text-purple-500', btnClass: 'bg-purple-500 hover:bg-purple-600' },
  ].filter(doc => doc.url);

  if (documents.length === 0) return null;

  const handleDownloadClick = (documentType: string, documentUrl: string | null) => {
    setActiveDownload({ isOpen: true, documentType, documentUrl });
  };

  const handleClose = () => {
    setActiveDownload({ isOpen: false, documentType: '', documentUrl: null });
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-[#0a1628] mb-6 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
          Documents & Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all bg-gray-50/50 hover:bg-white cursor-pointer"
              onClick={() => handleDownloadClick(doc.label, doc.url)}
            >
              <div className={`w-12 h-12 rounded-xl ${doc.bgClass} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <doc.icon className={`w-6 h-6 ${doc.textClass}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#0a1628] group-hover:text-orange-500 transition-colors truncate">
                  {doc.label}
                </h4>
                <p className="text-xs text-gray-400">PDF Available</p>
              </div>
              <button className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide ${doc.btnClass} text-white transition-all flex items-center gap-2`}>
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Form Modal */}
      <DocumentDownloadLead
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        documentType={activeDownload.documentType}
        documentUrl={activeDownload.documentUrl}
        isOpen={activeDownload.isOpen}
        onClose={handleClose}
      />
    </>
  );
}
