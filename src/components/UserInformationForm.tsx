import { useState, FormEvent } from 'react';
import { UserInfo } from '../types';
import { INDUSTRIES } from '../data';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface UserInformationFormProps {
  onBack: () => void;
  onSubmit: (info: UserInfo) => void;
  key?: string;
}

export default function UserInformationForm({ onBack, onSubmit }: UserInformationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [social, setSocial] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!industry) {
      setError('Please select your primary industry.');
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      industry,
      website: website.trim() || undefined,
      social: social.trim() || undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-24 selection:bg-[#82e3aa]/20 selection:text-gray-900 font-sans">
      
      {/* Back button positioned above the main content to let it breathe */}
      <div className="mb-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-14 shadow-3xl relative overflow-hidden"
      >
        
        {/* Subtle, soft light background blob for card interior */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#81eee8]/5 via-[#82e3aa]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Introduction */}
        <div className="mb-12 relative z-10">
          <span className="text-[#42c28b] font-bold tracking-widest text-[10px] uppercase block mb-3 font-mono">
            Onboarding Consultation
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4 leading-tight">
            Tell us about your brand
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
            This intake customizes the scoring parameters. Your responses guide the engine to construct highly contextual checklists for your business profile.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-[#fb7474]/10 border border-[#fb7474]/20 text-[#fb7474] text-xs font-bold"
            >
              {error}
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Full Name <span className="text-[#fb7474] font-bold">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Carter"
                className="w-full px-5 py-4 text-sm bg-[#FBFBFA]/60 hover:bg-[#FBFBFA] focus:bg-white rounded-2xl border border-gray-100 focus:border-[#42c28b] focus:ring-4 focus:ring-[#42c28b]/5 outline-none transition-all duration-250 text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>

            <div>
              <label htmlFor="emailAddress" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Email Address <span className="text-[#fb7474] font-bold">*</span>
              </label>
              <input
                id="emailAddress"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@studio.com"
                className="w-full px-5 py-4 text-sm bg-[#FBFBFA]/60 hover:bg-[#FBFBFA] focus:bg-white rounded-2xl border border-gray-100 focus:border-[#42c28b] focus:ring-4 focus:ring-[#42c28b]/5 outline-none transition-all duration-250 text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label htmlFor="industryDropdown" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Primary Discipline <span className="text-[#fb7474] font-bold">*</span>
            </label>
            <div className="relative">
              <select
                id="industryDropdown"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-5 py-4 text-sm bg-[#FBFBFA]/60 hover:bg-[#FBFBFA] focus:bg-white rounded-2xl border border-gray-100 focus:border-[#42c28b] focus:ring-4 focus:ring-[#42c28b]/5 outline-none transition-all duration-250 text-gray-900 font-medium appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-gray-400">Select your discipline...</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} className="text-gray-800">
                    {ind}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="websiteUrl" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Website URL <span className="text-gray-300 font-normal">(Optional)</span>
              </label>
              <input
                id="websiteUrl"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://mybrand.com"
                className="w-full px-5 py-4 text-sm bg-[#FBFBFA]/60 hover:bg-[#FBFBFA] focus:bg-white rounded-2xl border border-gray-100 focus:border-[#42c28b] focus:ring-4 focus:ring-[#42c28b]/5 outline-none transition-all duration-250 text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>

            <div>
              <label htmlFor="socialProfile" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Social Link / Profile <span className="text-gray-300 font-normal">(Optional)</span>
              </label>
              <input
                id="socialProfile"
                type="text"
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                placeholder="linkedin.com/in/alex"
                className="w-full px-5 py-4 text-sm bg-[#FBFBFA]/60 hover:bg-[#FBFBFA] focus:bg-white rounded-2xl border border-gray-100 focus:border-[#42c28b] focus:ring-4 focus:ring-[#42c28b]/5 outline-none transition-all duration-250 text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-8 py-4.5 bg-[#42c28b] hover:bg-[#34b07c] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#42c28b]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-3.5 group"
            >
              Begin Consultation
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2.5 text-xs text-gray-400">
          <Sparkles className="w-4 h-4 text-[#42c28b] shrink-0" />
          <span>Your baseline data is encrypted and will only be used to calibrate your report score.</span>
        </div>
      </motion.div>
    </div>
  );
}
