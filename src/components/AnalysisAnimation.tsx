import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnalysisAnimationProps {
  onFinished: () => void;
  key?: string;
}

export default function AnalysisAnimation({ onFinished }: AnalysisAnimationProps) {
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);

  const tasks = [
    'Evaluating brand clarity and 5-second unique value index...',
    'Analyzing trust validators, portfolios, and testimonial weight...',
    'Reviewing typography, color consistency, and visual experience...',
    'Simulating client pathways and CTA conversion readiness...',
    'Synthesizing personalized Web Design King recommendations...',
  ];

  useEffect(() => {
    if (activeTaskIndex < tasks.length) {
      const timeout = setTimeout(() => {
        setActiveTaskIndex((prev) => prev + 1);
      }, 900); // 900ms per task
      return () => clearTimeout(timeout);
    } else {
      const finishedTimeout = setTimeout(() => {
        onFinished();
      }, 400);
      return () => clearTimeout(finishedTimeout);
    }
  }, [activeTaskIndex]);

  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center selection:bg-brand-primary-light selection:text-gray-900">
      <div className="bg-white rounded-[40px] border border-gray-100 p-10 md:p-14 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Background Ring */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-64 h-64 rounded-full border border-[#82e3aa]/10"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-48 h-48 rounded-full border border-[#81eee8]/10"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Pulsing Brand Logo */}
          <motion.img
            src="https://res.cloudinary.com/dtkluxukm/image/upload/v1781877708/8_cwwfre.png"
            alt="Audit Engine Logo"
            className="h-20 w-auto object-contain mb-8"
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            referrerPolicy="no-referrer"
          />

          <span className="text-[10px] font-bold tracking-widest text-[#42c28b] uppercase mb-3 font-mono">
            STRATEGIC AUDIT IN ACTION
          </span>
          <h3 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight mb-8 font-sans">
            Analyzing your digital presence...
          </h3>

          {/* Staggered text tasks */}
          <div className="w-full max-w-sm h-12 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTaskIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="text-sm font-semibold text-gray-500 font-sans"
              >
                {tasks[Math.min(activeTaskIndex, tasks.length - 1)]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Dynamic Loading Dots */}
          <div className="flex gap-2 justify-center">
            {tasks.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx <= activeTaskIndex ? 'bg-[#42c28b] scale-110' : 'bg-gray-100 scale-100'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
