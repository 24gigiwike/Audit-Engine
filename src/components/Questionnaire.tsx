import { useState } from 'react';
import { AUDIT_QUESTIONS } from '../data';
import { Sparkles, ArrowLeft, ArrowRight, Check } from 'lucide-react';
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

  const handleSelectOption = (score: number) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(updatedAnswers);

    // Auto advance after brief delay for smooth interaction
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete(updatedAnswers);
      }
    }, 280);
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

  // Category Title
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'clarity':
        return 'Brand Clarity';
      case 'trust':
        return 'Trust & Credibility';
      case 'visual':
        return 'Visual Experience';
      case 'conversion':
        return 'Conversion System';
      case 'growth':
        return 'Growth Foundation';
      default:
        return 'Digital Assessment';
    }
  };

  // Friendly contextual microcopy
  const getMicrocopy = (index: number) => {
    if (index === 0) return "Let's establish how people experience your brand online.";
    if (index === 3) return "Great! Let's understand why prospects should trust you.";
    if (index === 5) return "We're halfway through! Let's evaluate your design caliber.";
    if (index === 7) return "You are doing amazing. Let's check how easily attention becomes deals.";
    if (index === 9) return "Almost done! Let's secure your client acquisition foundations.";
    return null;
  };

  const activeMicrocopy = getMicrocopy(currentIndex);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-20 selection:bg-[#82e3aa]/20 selection:text-gray-900 font-sans">
      
      {/* Progress & Indicator */}
      <div className="mb-5 flex items-center justify-between text-xs font-bold text-gray-400">
        <span className="tracking-widest uppercase font-mono text-[10px]">Audit Progress</span>
        <span className="font-mono text-gray-800 font-extrabold">{progressPercent}% ({currentIndex + 1}/{totalQuestions})</span>
      </div>

      <div className="w-full bg-gray-100 h-1 rounded-full mb-10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#42c28b] to-[#81eee8]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Encouraging Microcopy Toast */}
      <div className="h-14 mb-4">
        <AnimatePresence mode="wait">
          {activeMicrocopy ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="p-3.5 bg-[#81eee8]/8 border border-[#42c28b]/10 rounded-2xl flex items-center gap-3"
            >
              <Sparkles className="w-4 h-4 text-[#42c28b] shrink-0" />
              <p className="text-xs font-semibold text-gray-600 leading-normal">
                {activeMicrocopy}
              </p>
            </motion.div>
          ) : <div className="h-full" />}
        </AnimatePresence>
      </div>

      {/* Main Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-14 shadow-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#81eee8]/4 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="mb-8 flex items-center justify-between relative z-10">
          <span className="px-3 py-1 bg-[#FBFBFA] border border-gray-100 rounded-lg text-[10px] font-extrabold text-gray-500 font-mono tracking-wider">
            {currentQuestion.label}
          </span>
          <span className="text-[10px] font-bold text-[#42c28b] uppercase tracking-widest font-mono">
            {getCategoryTitle(currentQuestion.category)}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-extrabold text-[#1A1A1A] tracking-tight leading-snug mb-10 relative z-10">
          {currentQuestion.text}
        </h3>

        {/* Answer Options list */}
        <div className="space-y-4 relative z-10">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentQuestion.id] === option.score;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option.score)}
                className={`w-full text-left p-5 md:p-6 rounded-2xl border transition-all duration-250 cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-[#42c28b] bg-[#42c28b]/4 shadow-md shadow-[#42c28b]/5'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-[#FBFBFA]/60 bg-white'
                }`}
              >
                <span className={`text-sm md:text-base leading-relaxed pr-6 ${
                  isSelected ? 'font-bold text-gray-900' : 'text-gray-600 font-semibold group-hover:text-gray-900'
                }`}>
                  {option.text}
                </span>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-[#42c28b] border-[#42c28b] text-white scale-100'
                    : 'border-gray-200 group-hover:border-gray-300 bg-white text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Back and Next Controls */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between relative z-10">
          <button
            onClick={handlePrev}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-xl transition-all duration-200 ${
              answers[currentQuestion.id] !== undefined
                ? 'text-[#42c28b] hover:text-[#34b07c] cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
