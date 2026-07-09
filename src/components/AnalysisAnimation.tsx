import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnalysisAnimationProps {
  onFinished: () => void;
  key?: string;
}

export default function AnalysisAnimation({ onFinished }: AnalysisAnimationProps) {
  const [completedIndex, setCompletedIndex] = useState(-1);

  const pillars = [
    'Brand Positioning',
    'Trust Signals',
    'User Experience',
    'Conversion Journey',
    'Communication',
    'Visibility',
    'Authority'
  ];

  useEffect(() => {
    // Animate each item completing one after another
    const interval = setInterval(() => {
      setCompletedIndex((prev) => {
        if (prev < pillars.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Wait briefly after all are done before continuing
          setTimeout(() => {
            onFinished();
          }, 600);
          return prev;
        }
      });
    }, 450); // Each pillar takes 450ms, totaling ~3.15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-[#111111] font-sans flex flex-col items-center justify-center px-6 py-12 select-none">
      <div className="max-w-md w-full border border-[#E9E9E9] bg-[#F7F7F7] rounded-2xl p-8 md:p-12 shadow-sm space-y-8">
        
        {/* Animated header section */}
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] font-bold tracking-widest text-[#42C28B] uppercase font-mono">
            Audit Calibration
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-[#111111]">
            Analysing your digital presence...
          </h2>
        </div>

        {/* Beautiful checklist items */}
        <div className="space-y-4">
          {pillars.map((pillar, idx) => {
            const isCompleted = idx <= completedIndex;
            const isActive = idx === completedIndex + 1;

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 bg-white"
                style={{
                  borderColor: isCompleted ? '#42C28B' : isActive ? '#82E3AA' : '#E9E9E9',
                }}
              >
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isCompleted ? 'text-[#111111]' : isActive ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {pillar}
                </span>

                <div className="relative flex items-center justify-center w-5 h-5">
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="w-5 h-5 rounded-full bg-[#42C28B] flex items-center justify-center text-white"
                      >
                        <Check className="w-3 h-3 stroke-[4]" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="dot"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2.5 h-2.5 rounded-full bg-[#82E3AA]"
                      />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small subtle progress label */}
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
            {completedIndex === pillars.length - 1 ? 'Synthesis Complete' : 'Interpreting Audit Points'}
          </p>
        </div>

      </div>
    </div>
  );
}
