import { useState, FormEvent } from 'react';
import { UserInfo } from '../types';
import { INDUSTRIES } from '../data';
import { ArrowRight, ArrowLeft } from 'lucide-react';
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
      setError('Please select your primary discipline.');
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
    <div className="min-h-screen w-full bg-white text-[#111111] font-sans flex flex-col justify-between selection:bg-[#82e3aa]/20 selection:text-[#111111]">
      
      {/* Top Bar matching Questionnaire styling */}
      <header className="w-full px-6 py-6 md:px-12 flex items-center justify-between border-b border-[#E9E9E9] bg-white">
        <div className="flex items-center gap-2">
          <img 
            src="https://res.cloudinary.com/dtkluxukm/image/upload/v1781877708/8_cwwfre.png" 
            alt="Web Design King Logo"
            className="h-7 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="font-extrabold tracking-wide uppercase text-[10px] text-[#111111]">
            WEB DESIGN <span className="text-[#42C28B]">KING</span>
          </span>
        </div>
        
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 font-mono">
          Onboarding
        </div>
      </header>

      {/* Progress line dummy indicating we are starting */}
      <div className="w-full h-[2px] bg-[#E9E9E9]">
        <div className="h-full bg-[#42C28B] w-1/12 transition-all duration-500" />
      </div>

      {/* Content Form container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col justify-center space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-bold tracking-widest text-[#42C28B] uppercase font-mono">
            Calibrate Context
          </span>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#111111] leading-tight">
            Tell us about your brand.
          </h2>
          <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
            Before measuring performance, we calibrate our evaluation criteria against your specific discipline.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#FB7474]/10 border border-[#FB7474]/20 text-[#FB7474] text-xs font-bold"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Full Name */}
            <div className="space-y-2.5">
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                Full Name <span className="text-[#FB7474]">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Carter"
                className="w-full px-5 py-4 text-sm bg-white rounded-xl border border-[#E9E9E9] focus:border-[#42C28B] focus:ring-2 focus:ring-[#42C28B]/5 outline-none transition-all duration-200 text-[#111111] placeholder-gray-400 font-medium shadow-sm hover:border-gray-300"
              />
            </div>

            {/* Email */}
            <div className="space-y-2.5">
              <label htmlFor="emailAddress" className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                Email Address <span className="text-[#FB7474]">*</span>
              </label>
              <input
                id="emailAddress"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@studio.com"
                className="w-full px-5 py-4 text-sm bg-white rounded-xl border border-[#E9E9E9] focus:border-[#42C28B] focus:ring-2 focus:ring-[#42C28B]/5 outline-none transition-all duration-200 text-[#111111] placeholder-gray-400 font-medium shadow-sm hover:border-gray-300"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            {/* Primary Discipline */}
            <div className="space-y-2.5">
              <label htmlFor="industryDropdown" className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                Primary Discipline <span className="text-[#FB7474]">*</span>
              </label>
              <div className="relative">
                <select
                  id="industryDropdown"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-5 py-4 text-sm bg-white rounded-xl border border-[#E9E9E9] focus:border-[#42C28B] focus:ring-2 focus:ring-[#42C28B]/5 outline-none transition-all duration-200 text-[#111111] font-medium appearance-none cursor-pointer shadow-sm hover:border-gray-300"
                >
                  <option value="" disabled>Select your primary discipline...</option>
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
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Website */}
            <div className="space-y-2.5">
              <label htmlFor="websiteUrl" className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                Website URL <span className="text-gray-300 font-normal">(Optional)</span>
              </label>
              <input
                id="websiteUrl"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://mybrand.com"
                className="w-full px-5 py-4 text-sm bg-white rounded-xl border border-[#E9E9E9] focus:border-[#42C28B] focus:ring-2 focus:ring-[#42C28B]/5 outline-none transition-all duration-200 text-[#111111] placeholder-gray-400 font-medium shadow-sm hover:border-gray-300"
              />
            </div>

            {/* Social Link */}
            <div className="space-y-2.5">
              <label htmlFor="socialProfile" className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                Social Link / Profile <span className="text-gray-300 font-normal">(Optional)</span>
              </label>
              <input
                id="socialProfile"
                type="text"
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                placeholder="linkedin.com/in/alex"
                className="w-full px-5 py-4 text-sm bg-white rounded-xl border border-[#E9E9E9] focus:border-[#42C28B] focus:ring-2 focus:ring-[#42C28B]/5 outline-none transition-all duration-200 text-[#111111] placeholder-gray-400 font-medium shadow-sm hover:border-gray-300"
              />
            </div>
          </div>

          {/* Bottom navigation layout matching specification */}
          <div className="pt-10 flex items-center justify-between border-t border-[#E9E9E9]">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>

            <button
              type="submit"
              className="group px-6 py-3.5 bg-[#42C28B] text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              Begin Consultation
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
