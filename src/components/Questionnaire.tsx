import { useState } from 'react';
import { AUDIT_QUESTIONS } from '../data';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionnaireProps {
  onBackToInfo: () => void;
  onComplete: (answers: Record<string, number>) => void;
  key?: string;
}

export default function Questionnaire({ onBackToInfo, onComplete }: QuestionnaireProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQuestion = AUDIT_QUESTIONS[currentIndex];
  const totalQuestions = AUDIT_QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const formattedIndex = (currentIndex + 1).toString().padStart(2, '0');
  const formattedTotal = totalQuestions.toString().padStart(2, '0');

  const handleSelectOption = (score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: score,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onBackToInfo();
    }
  };

  const handleNext = () => {
    if (answers[currentQuestion.id] !== undefined) {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete(answers);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#111111] font-sans flex flex-col justify-between selection:bg-[#82e3aa]/20 selection:text-[#111111]">
      
      {/* 1. TOP BAR (Very minimal) */}
      <header className="relative z-20 w-full px-6 py-6 md:px-12 flex items-center justify-between bg-white">
        {/* Left: Web Design King logo */}
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

        {/* Right: Question Number indicator */}
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 font-mono">
          Question {formattedIndex} / {formattedTotal}
        </div>
      </header>

      {/* Progress line underneath (Green, Animated, 2px height) */}
      <div className="w-full h-[2px] bg-[#E9E9E9]">
        <motion.div
          className="h-full bg-[#42C28B]"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      {/* 2. QUESTION LAYOUT (Spacious, Centered) */}
      <main className="flex-1 flex flex-col justify-center px-6 py-12 md:py-24 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-12"
          >
            {/* Category tag */}
            <div className="text-center">
              <span className="px-3 py-1.5 bg-[#F7F7F7] border border-[#E9E9E9] rounded-full text-[10px] font-bold tracking-widest uppercase text-gray-400 font-mono">
                {currentQuestion.label}
              </span>
            </div>

            {/* Question centered in Large Editorial Typography */}
            <h1 className="text-center text-[#111111] font-medium tracking-tight leading-[1.2] max-w-3xl mx-auto"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
              {currentQuestion.text}
            </h1>

            {/* Answer Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option.score;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(option.score)}
                    className={`group p-7 rounded-xl border cursor-pointer select-none transition-all duration-300 shadow-sm flex flex-col justify-between min-h-[160px] relative ${
                      isSelected
                        ? 'border-[#42C28B] bg-[#42C28B]/[0.02] ring-1 ring-[#42C28B]'
                        : 'border-[#E9E9E9] bg-white hover:border-[#42C28B] hover:-translate-y-1 hover:bg-[#42C28B]/[0.01] hover:shadow-md'
                    }`}
                  >
                    {/* Selected Check Icon */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        Option {idx + 1}
                      </span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-[#42C28B] flex items-center justify-center text-white scale-100 transition-transform duration-200">
                          <Check className="w-2.5 h-2.5 stroke-[4.5]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-200 group-hover:border-[#42C28B]/40 transition-colors" />
                      )}
                    </div>

                    <p className={`text-sm leading-relaxed ${
                      isSelected ? 'font-semibold text-[#111111]' : 'text-gray-600'
                    }`}>
                      {option.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. NAVIGATION BUTTONS (Back Left, Continue Right) */}
      <footer className="w-full px-6 py-6 md:px-12 border-t border-[#E9E9E9] bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          {/* Back Button: Minimal Text Button, No outlined buttons */}
          <button
            onClick={handlePrev}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Continue Button: Bottom right, Not full width on desktop, Premium with Arrow animation */}
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className={`group px-6 py-3.5 rounded-xl transition-all duration-300 font-semibold text-xs uppercase tracking-widest flex items-center gap-2 ${
              answers[currentQuestion.id] !== undefined
                ? 'bg-[#42C28B] text-white hover:bg-[#42C28B]/90 shadow-sm active:scale-95 cursor-pointer'
                : 'bg-[#F7F7F7] text-gray-300 border border-[#E9E9E9] cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

        </div>
      </footer>
    </div>
  );
}
