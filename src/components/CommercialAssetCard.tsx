import React from 'react';
import { Building, TrendingUp } from 'lucide-react';

const CommercialAssetCard = ({ property }: { property: any }) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
      <div className="flex items-center mb-8">
        <div className="w-14 h-14 bg-blue-50 text-[#0a1628] rounded-2xl flex items-center justify-center mr-5">
          <Building className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-[#0a1628]">{property.title}</h3>
          <p className="text-sm text-gray-500">{property.location}</p>
        </div>
      </div>
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Tenant Brand</span>
          <span className="font-bold text-[#0a1628]">{property.tenantBrand}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Lease Term</span>
          <span className="font-bold text-[#0a1628]">{property.leaseTerm}</span>
        </div>
        <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
          <span className="text-gray-500">Expected ROI</span>
          <span className="font-bold text-lg text-orange-500">{property.roi} Yearly</span>
        </div>
      </div>
      <button className="w-full py-3.5 rounded-full bg-gray-50 text-[#0a1628] font-bold hover:bg-gray-100 transition-colors">
        View Investment Deck
      </button>
    </div>
  );
};

export default CommercialAssetCard;
