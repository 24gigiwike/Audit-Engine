import { ArrowRight, Clock, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { incrementAnalytics } from '../utils';
import ShaderBackground from './ShaderBackground';

interface LandingPageProps {
  onStart: () => void;
  onOpenOwnerPortal: () => void;
  key?: string;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const handleStartAudit = () => {
    incrementAnalytics('assessmentStarts');
    onStart();
  };

  return (
    <div className="relative h-screen w-screen bg-white text-[#111111] overflow-hidden flex flex-col font-sans select-none">
      {/* 1. Subtle Shader Animation Background Overlay */}
      <ShaderBackground />

      {/* 2. Top Navigation Bar */}
      <header className="relative z-20 w-full px-8 py-6 md:px-12 flex items-center justify-between">
        {/* Spacer to perfectly center the logo */}
        <div className="w-40 hidden md:block" />

        {/* Centered Web Design King Logo Only */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <img 
            src="https://res.cloudinary.com/dtkluxukm/image/upload/v1781877708/8_cwwfre.png" 
            alt="Web Design King Logo"
            className="h-8 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col text-left">
            <span className="font-extrabold tracking-wide uppercase text-[11px] leading-tight text-[#111111]">
              WEB DESIGN <span className="text-[#42C28B]">KING</span>
            </span>
            <span className="text-[7px] font-bold tracking-widest text-gray-400 uppercase leading-none mt-0.5">
              Audit Engine™
            </span>
          </div>
        </div>

        {/* Top Right: Estimated Time Badge (Minimal Outlined Pill) */}
        <div className="absolute right-6 top-6 md:static flex items-center gap-2 px-3 py-1.5 border border-[#E9E9E9] rounded-full text-[10px] md:text-xs font-medium text-gray-500 bg-white/80 backdrop-blur-sm shadow-sm">
          <Clock className="w-3.5 h-3.5 text-[#42C28B]" />
          <span>3 Mins</span>
          <span className="text-gray-300">•</span>
          <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
          <span>12 Questions</span>
        </div>
      </header>

      {/* 3. Hero Content (Perfectly Centered Vertically) */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 text-center pb-12 md:pb-24">
        <div className="max-w-[720px] space-y-8 flex flex-col items-center">
          
          {/* Animated Headline with Clamp sizing */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-sans font-medium text-[#111111] leading-[1.05] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.8rem)' }}
          >
            Discover how your<br />digital presence is<br />really performing.
          </motion.h1>

          {/* Supporting Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-gray-600 font-sans leading-[1.75] max-w-[560px] text-base md:text-[16px]"
          >
            Answer a few carefully designed questions and receive a personalised report highlighting your strengths, weaknesses and next priorities.
          </motion.p>

          {/* CTA Action Block */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="pt-4 flex flex-col items-center gap-3.5"
          >
            {/* Premium Green Button with Text Roll and Arrow Rotation */}
            <button
              onClick={handleStartAudit}
              className="group relative overflow-hidden px-8 py-4 bg-[#42C28B] text-white font-semibold text-sm tracking-wide uppercase rounded-xl transition-all duration-300 shadow-md shadow-[#42C28B]/10 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-2.5"
            >
              {/* Text roll mask container */}
              <span className="relative inline-flex flex-col overflow-hidden h-5">
                <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-full">
                  Start Free Audit
                </span>
                <span className="absolute inline-block transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] top-full group-hover:-translate-y-full font-bold">
                  Start Free Audit
                </span>
              </span>

              {/* Arrow rotates on hover */}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:rotate-45" />
            </button>

            {/* Microcopy under CTA */}
            <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
              <span>No sign up required</span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <span>Results in under 3 minutes</span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
