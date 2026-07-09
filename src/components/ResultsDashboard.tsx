import { useState, useEffect } from 'react';
import { AuditResult, UserInfo } from '../types';
import { ChevronDown, ArrowRight, Download, Calendar, ArrowLeft, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { incrementAnalytics } from '../utils';

interface ResultsDashboardProps {
  result: AuditResult;
  userInfo: UserInfo;
  onReset: () => void;
  key?: string;
}

export default function ResultsDashboard({ result, userInfo, onReset }: ResultsDashboardProps) {
  const { overallScore, categoryResults, tier, strengths, weaknesses, recommendations } = result;
  
  // Interactive Accordion state
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  
  // Animated Score Counter state
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = overallScore;
    if (start === end) return;

    const totalDuration = 1000; // 1s score count animation
    const incrementTime = Math.abs(Math.floor(totalDuration / end));

    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [overallScore]);

  const handleBookConsultation = () => {
    incrementAnalytics('ctaClicks');
    window.open('https://www.webdesignking.online', '_blank', 'noopener,noreferrer');
  };

  const handleDownloadReport = () => {
    incrementAnalytics('ctaClicks');
    window.print();
  };

  // Maps score to the specific premium wording requested
  const getScoreDescription = (score: number) => {
    if (score >= 85) return 'Digital Authority';
    if (score >= 70) return 'Excellent Foundation';
    if (score >= 50) return 'Strong Foundation';
    return 'Strategic Refinement Required';
  };

  // Convert the generic category results to the 6 requested ones
  const customCategories = [
    { name: 'Brand Positioning', score: categoryResults.clarity?.score || 14, maxScore: 20 },
    { name: 'Visual Trust', score: categoryResults.visual?.score || 14, maxScore: 20 },
    { name: 'Communication', score: categoryResults.trust?.score || 14, maxScore: 20 },
    { name: 'Conversion', score: categoryResults.conversion?.score || 14, maxScore: 20 },
    { name: 'Authority', score: categoryResults.growth?.score || 12, maxScore: 20 },
    { name: 'Visibility', score: Math.round(((categoryResults.growth?.score || 12) + (categoryResults.clarity?.score || 14)) / 2), maxScore: 20 },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans pb-24 selection:bg-[#82e3aa]/20 selection:text-[#111111] print:bg-white print:p-0">
      
      {/* 1. Header (Navigation layout for Results page) */}
      <header className="w-full px-6 py-6 md:px-12 flex items-center justify-between border-b border-[#E9E9E9] bg-white print:hidden">
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

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-all duration-200 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retake Audit
        </button>
      </header>

      {/* Main Results Workspace Grid */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-20">
        
        {/* Experience 4: RESULTS Part A - Score Area */}
        <section className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Big Animated Score Circle */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-8 border border-[#E9E9E9] bg-[#F7F7F7] rounded-xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono mb-4 block">
              Digital Presence Score
            </span>
            <div className="text-8xl font-medium tracking-tight text-[#111111] font-sans">
              {displayScore}
            </div>
            <div className="text-sm font-semibold tracking-wide uppercase text-[#42C28B] mt-4 font-sans">
              {getScoreDescription(overallScore)}
            </div>
          </div>

          {/* Core score feedback */}
          <div className="md:col-span-7 space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-[#42C28B] uppercase font-mono">
              Audit Assessment Report
            </span>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight leading-[1.15] text-[#111111]">
              Greetings {userInfo.name},<br />
              here is your digital score.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Our analysis model compared your profiles against elite high-performance benchmarks in the <strong className="text-gray-800">{userInfo.industry}</strong> sector. Your baseline score is <strong className="text-gray-800">{overallScore}/100</strong>. This score highlights that you have a solid platform, but there are high-value optimizations ready to be unlocked.
            </p>
          </div>
        </section>

        {/* Experience 4: RESULTS Part B - Category Scores */}
        <section className="space-y-8">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-widest text-[#42C28B] uppercase font-mono">
              The Six Critical Pillars
            </span>
            <h3 className="text-xl font-medium tracking-tight text-[#111111]">
              Pillar Breakdown Results
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {customCategories.map((cat, idx) => {
              const pct = (cat.score / cat.maxScore) * 100;
              return (
                <div key={idx} className="p-5 border border-[#E9E9E9] bg-white rounded-xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-700">{cat.name}</span>
                    <span className="font-mono text-gray-400">{cat.score} / {cat.maxScore}</span>
                  </div>
                  {/* High quality clean progress bar */}
                  <div className="w-full bg-[#F7F7F7] h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#42C28B]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Experience 4: RESULTS Part C - Insight Panel */}
        <section className="p-8 border border-[#E9E9E9] bg-[#F7F7F7] rounded-xl shadow-sm space-y-4">
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-mono block">
            Expert Advisory Synthesis
          </span>
          <h3 className="text-lg font-medium tracking-tight text-[#111111]">
            What stood out
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed font-sans font-normal">
            As a consultant reviewing this assessment, the primary bottleneck is a misalignment between your service expertise and your digital profile's conversion structure. While {userInfo.name} displays solid credentials, high-ticket buyers currently encounter unnecessary administrative friction and generalist messaging. By implementing structured trust signals and optimizing call availability, you can elevate your perceived caliber and command premium rates in your industry.
          </p>

          {/* Quick list of Strengths and Friction */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-[#E9E9E9] mt-6">
            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#42C28B] font-mono flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> High-Value Strengths
              </span>
              <ul className="space-y-1.5 text-xs text-gray-500">
                {strengths.slice(0, 2).map((s, i) => (
                  <li key={i} className="list-disc list-inside leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#FB7474] font-mono flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Primary Friction
              </span>
              <ul className="space-y-1.5 text-xs text-gray-500">
                {weaknesses.slice(0, 2).map((w, i) => (
                  <li key={i} className="list-disc list-inside leading-relaxed">{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Experience 4: RESULTS Part D - Priority Actions Accordion */}
        <section className="space-y-8">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-widest text-[#42C28B] uppercase font-mono">
              Bespoke Priority Checklist
            </span>
            <h3 className="text-xl font-medium tracking-tight text-[#111111]">
              Personalized Priority Actions
            </h3>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, idx) => {
              const isExpanded = expandedIndex === idx;
              const formattedNumber = (idx + 1).toString().padStart(2, '0');
              const impactLevel = idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low';
              const badgeColor = 
                impactLevel === 'High' ? 'bg-[#FB7474]/10 text-[#FB7474] border-[#FB7474]/20' :
                impactLevel === 'Medium' ? 'bg-[#FBF6BC]/40 text-amber-700 border-[#FBF6BC]' :
                'bg-[#82E3AA]/10 text-[#42C28B] border-[#82E3AA]/20';

              return (
                <div 
                  key={idx}
                  className="border border-[#E9E9E9] rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300"
                >
                  {/* Accordion Trigger Header */}
                  <div 
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-6 flex items-center justify-between cursor-pointer select-none hover:bg-[#F7F7F7] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-gray-400">
                        {formattedNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-[#111111]">
                          {rec.categoryName || 'Strategic Priority'}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full border ${badgeColor}`}>
                        {impactLevel} Impact
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`} />
                    </div>
                  </div>

                  {/* Accordion Content Block (Problem -> Why it matters -> Specific actions -> Expected outcome) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden border-t border-[#E9E9E9]"
                      >
                        <div className="p-6 md:p-8 bg-[#F7F7F7] space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed">
                          
                          {/* 1. Problem / Priority Area */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold tracking-widest text-[#42C28B] uppercase font-mono block">
                              Problem / Priority Area
                            </span>
                            <p className="text-[#111111] font-medium font-sans">
                              {rec.priorityArea || 'Establishing critical strategic authority bounds.'}
                            </p>
                          </div>

                          <div className="text-gray-300 text-center select-none py-0.5">↓</div>

                          {/* 2. Why It Matters */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-mono block">
                              Why it matters
                            </span>
                            <p className="text-gray-500">
                              {rec.whyMatters || rec.reason || 'Without clear validation, premium buyers compare your service strictly on cost.'}
                            </p>
                          </div>

                          <div className="text-gray-300 text-center select-none py-0.5">↓</div>

                          {/* 3. Specific Actions */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold tracking-widest text-[#42C28B] uppercase font-mono block">
                              Specific actions
                            </span>
                            <div className="p-4 border border-[#E9E9E9] bg-white rounded-lg text-[#111111] font-semibold">
                              {rec.actionItem}
                            </div>
                          </div>

                          <div className="text-gray-300 text-center select-none py-0.5">↓</div>

                          {/* 4. Expected Outcome */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-mono block">
                              Expected outcome
                            </span>
                            <p className="text-gray-500">
                              {rec.expectedOutcome || 'A high-converting inbound pipeline commanding premium market pricing.'}
                            </p>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Experience 5: FINAL CTA - Celebration & Book Consultation */}
        <section className="py-12 border-t border-[#E9E9E9] text-center space-y-8">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold tracking-widest text-[#42C28B] uppercase font-mono bg-[#82E3AA]/10 px-3 py-1.5 rounded-full inline-block">
              Audit Complete
            </span>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#111111] leading-tight">
              Your report is ready.<br />Now build a digital presence that matches your potential.
            </h2>
          </div>

          {/* Action Buttons layout */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto print:hidden">
            <button
              onClick={handleBookConsultation}
              className="w-full sm:w-auto px-8 py-4 bg-[#42C28B] text-white font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-[#42C28B]/90 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
            >
              Book a Consultation
              <Calendar className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>

            <button
              onClick={handleDownloadReport}
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-[#E9E9E9] font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-[#F7F7F7] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              Download My Report
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Small Note Underneath */}
          <div className="pt-6 max-w-xl mx-auto text-xs text-gray-400 leading-relaxed">
            <p className="font-bold uppercase tracking-wider text-[9px] text-[#42C28B] mb-2">Need expert help?</p>
            <p>
              Web Design King helps businesses turn audit insights into premium digital experiences.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
