"use client";
import React from 'react';
import { X } from 'lucide-react';
import LeadForm from './LeadForm';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  propertyId: string;
}

export default function LeadModal({ isOpen, onClose, title, propertyId }: LeadModalProps) {
  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-[#0a1628]/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 pb-12 transition-transform duration-500 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Schedule Visit</p>
            <h3 className="text-2xl font-black text-[#0a1628] leading-tight">Interested in {title}?</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Our consultant will call you back within 15 mins.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#0b1324] p-6 rounded-[2rem] text-white">
          <LeadForm propertyId={propertyId} propertyTitle={title} />
        </div>
      </div>
    </div>
  );
}
