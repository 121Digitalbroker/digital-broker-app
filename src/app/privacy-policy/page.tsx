import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* TOP BANNER (Minimalist like 99acres) */}
        <div className="pt-32 pb-12 bg-slate-50 flex flex-col items-center border-b border-slate-100">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Digitalbroker Policy</h1>
          <div className="w-12 h-1 bg-orange-500 rounded-full mt-4"></div>
        </div>

        {/* CONTENT (Professional Document Style) */}
        <section className="pt-16 px-6 max-w-4xl mx-auto w-full">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 pb-2 border-b border-slate-100">Privacy Policy</h2>
            
            <p className="text-slate-600 leading-relaxed mb-8">
              We, at Digitalbroker.in, are committed to respecting your online privacy and recognize your need for appropriate protection and management of any personally identifiable information you share with us.
            </p>

            <p className="text-slate-600 leading-relaxed mb-8">
              This Privacy Policy (<strong>"Policy"</strong>) governs our website available at <strong>Digitalbroker.in</strong>. The Policy describes how Digital Broker (hereinafter referred to as the <strong>"Company"</strong>) collects, uses, discloses and transfers personal data of users while browsing the <strong>Platform</strong> or availing specific services therein (the <strong>"Services"</strong>).
            </p>

            {/* 1. Introduction */}
            <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">1. Introduction</h3>
            <p className="text-slate-600 leading-relaxed">
              At Digitalbroker.in, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our real estate services.
            </p>

            {/* 2. Information We Collect */}
            <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">2. Information We Collect</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              We collect information that identifies you ("Personal Data"), which may include:
            </p>
            <div className="space-y-4 ml-4">
              {[
                { label: 'Identity Data', text: 'Name, age, and gender.' },
                { label: 'Contact Data', text: 'Email address, phone number, and mailing address.' },
                { label: 'Property Preferences', text: 'Location interests, budget, and property type (Residential/Commercial).' },
                { label: 'Technical Data', text: 'IP address, browser type, and usage patterns via cookies.' },
                { label: 'KYC Data', text: 'Documents such as PAN or Aadhaar when required for transactions.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0" />
                  <p className="text-slate-600 m-0"><strong className="text-slate-900">{item.label}:</strong> {item.text}</p>
                </div>
              ))}
            </div>

            {/* 3. Purpose of Collection */}
            <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">3. Purpose of Collection</h3>
            <p className="text-slate-600 leading-relaxed mb-4">We use your data strictly for:</p>
            <ul className="list-disc ml-8 space-y-2 text-slate-600">
              <li>Connecting you with relevant real estate listings.</li>
              <li>Responding to your inquiries via call, SMS, or WhatsApp.</li>
              <li>Improving our website experience.</li>
              <li>Legal compliance with RERA and other government regulations.</li>
            </ul>

            {/* 4. Consent and Your Rights */}
            <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">4. Consent and Your Rights</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              By using our website, you provide your affirmative consent to process your data. Under the DPDP Act, you have the right to:
            </p>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-6">
              {[
                { title: 'Access & Correction', text: 'Request a summary of the data we hold and correct inaccuracies.' },
                { title: 'Withdrawal of Consent', text: 'You may stop us from using your data at any time by contacting us.' },
                { title: 'Erasure', text: 'Request that we delete your data once the purpose of collection is fulfilled.' }
              ].map((item, i) => (
                <div key={i}>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500 m-0 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            {/* 5. Data Sharing */}
            <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">5. Data Sharing</h3>
            <p className="text-slate-600 leading-relaxed">
              We do not sell your personal data to third-party data brokers. We only share information with Government Authorities only when legally mandated (e.g., for RERA compliance or law enforcement).
            </p>

            {/* 6. Data Security */}
            <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">6. Data Security</h3>
            <p className="text-slate-600 leading-relaxed">
              We implement robust technical measures (like SSL encryption) to ensure your data is safe from unauthorized access. In the unlikely event of a data breach, we will notify the Data Protection Board of India and affected users as required by law.
            </p>

            {/* 7. Grievance Redressal (Professional Text Layout) */}
            <h3 className="text-xl font-bold text-slate-900 mt-12 mb-6">7. Grievance Redressal</h3>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
              <p className="text-slate-500 text-sm mb-8 italic">
                If you have concerns about your data, please contact our Grievance Officer:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Officer Details</h4>
                  <p className="text-slate-900 font-bold mb-1">[TBD - Grievance Officer]</p>
                  <p className="text-slate-600 text-sm">Designated Grievance Officer</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Email & Contact</h4>
                  <p className="text-slate-900 font-bold mb-1">privacy@digitalbroker.in</p>
                  <p className="text-slate-600 text-sm">Official Support Channel</p>
                </div>
                <div className="md:col-span-2 pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Office Address</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    924, Tower B, Bhutani Alphathum, Sector 90, Noida, UP 201305
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Last Updated: May 03, 2026
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
