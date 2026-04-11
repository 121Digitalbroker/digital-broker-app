"use client";
import React, { useState, useEffect } from 'react';
import { Calculator, ChevronRight, PieChart } from 'lucide-react';

interface EmiCalculatorProps {
  initialAmount: number;
  ticketDisplay: string;
}

const EmiCalculator = ({ initialAmount, ticketDisplay }: EmiCalculatorProps) => {
  const [loanAmount, setLoanAmount] = useState(initialAmount * 0.8); // 80% default
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const p = loanAmount;
    
    if (r === 0) {
      setEmi(p / n);
    } else {
      const calculatedEmi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(calculatedEmi);
    }
  }, [loanAmount, interestRate, tenure]);

  const formatPrice = (val: number) => {
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(2)} L`;
    return `₹ ${val.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-1 shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-br from-[#0a1628] to-[#142240] p-6 md:p-10 text-white">
        <h2 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-4">
          <div className="w-2 h-8 md:h-10 bg-orange-500 rounded-full" />
          Financing Options
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Loan Amount (₹)</p>
                <input 
                  type="number" 
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-black text-lg focus:outline-none focus:border-orange-500 transition-colors w-48 text-right"
                />
              </div>
              <input 
                type="range" 
                min={initialAmount * 0.1} 
                max={initialAmount * 1.5} 
                step={100000}
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                <span>{formatPrice(loanAmount)}</span>
                <span>Max: {ticketDisplay.split('-')[0].trim()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Interest Rate (% p.a)</p>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-black text-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Tenure (Years)</p>
                <div className="relative">
                  <input 
                    type="number" 
                    value={tenure} 
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-black text-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <p className="text-orange-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Estimated Monthly EMI</p>
              <div className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                ₹{Math.round(emi).toLocaleString()}
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/10">
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Interest</p>
                  <p className="text-sm font-black text-white">{formatPrice((emi * tenure * 12) - loanAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Payable</p>
                  <p className="text-sm font-black text-white">{formatPrice(emi * tenure * 12)}</p>
                </div>
              </div>

              <div className="mt-8 w-full">
                <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 active:scale-95">
                  Check Eligibility <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
