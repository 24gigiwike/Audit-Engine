import { AuditResult, UserInfo } from '../types';
import { Crown, CheckCircle2, AlertTriangle, ArrowRight, Printer, RotateCcw, ShieldCheck, Sparkles, Send, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { incrementAnalytics } from '../utils';

interface ResultsDashboardProps {
  result: AuditResult;
  userInfo: UserInfo;
  onReset: () => void;
  key?: string;
}

export default function ResultsDashboard({ result, userInfo, onReset }: ResultsDashboardProps) {
  const { overallScore, categoryResults, tier, strengths, weaknesses, recommendations } = result;

  const handleWorkWithWDK = () => {
    incrementAnalytics('ctaClicks');
    window.open('https://www.webdesignking.online', '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    incrementAnalytics('ctaClicks');
    window.print();
  };

  // Color mapping by tier
  const getTierColors = (t: string) => {
    switch (t) {
      case 'Digital Authority':
        return {
          bg: 'bg-[#ecfbf3]',
          border: 'border-brand-primary/20',
          text: 'text-[#23845b]',
          fill: '#42c28b',
        };
      case 'Strong Foundation':
        return {
          bg: 'bg-brand-primary-light/10',
          border: 'border-brand-primary-light/20',
          text: 'text-brand-primary',
          fill: '#82e3aa',
        };
      case 'Hidden Potential':
        return {
          bg: 'bg-[#fefce8]',
          border: 'border-[#fef08a]',
          text: 'text-[#a16207]',
          fill: '#eab308',
        };
      default:
        return {
          bg: 'bg-[#fef2f2]',
          border: 'border-brand-accent-coral/20',
          text: 'text-brand-accent-coral',
          fill: '#fb7474',
        };
    }
  };

  const colors = getTierColors(tier);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 selection:bg-brand-primary-light selection:text-[#1A1A1A] print:bg-white print:p-0 print:m-0">
      
      {/* HEADER SECTION FOR PRINT ONLY */}
      <div className="hidden print:flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A]">WEB DESIGN KING</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Digital Presence Audit™</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-[#1A1A1A]">{userInfo.name}</p>
          <p className="text-xs text-gray-500">{userInfo.email} • {userInfo.industry}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10 print:space-y-8"
      >
        {/* OVERVIEW SCORE CARD */}
        <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-2xl relative overflow-hidden print:shadow-none print:border-gray-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#82e3aa]/5 rounded-bl-full pointer-events-none print:hidden" />
          
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Left Score Gauge Column */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* SVG Radial Progress Background */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={colors.fill}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * overallScore) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>

                {/* Score Number Centered */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] font-sans tracking-tight">
                    {overallScore}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1 font-mono">
                    out of 100
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${colors.bg} ${colors.border} ${colors.text}`}>
                  {tier}
                </span>
              </div>
            </div>

            {/* Right Audit Summary Column */}
            <div className="md:col-span-7 space-y-4 text-center md:text-left">
              <span className="text-[#42c28b] font-bold tracking-widest text-[10px] uppercase font-mono">
                Bespoke Strategy Report
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight font-sans">
                Greetings {userInfo.name}, <br />
                here is your digital score.
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed font-sans">
                Our algorithm evaluated your digital profiles against elite high-conversion benchmarks in the <strong className="text-gray-800">{userInfo.industry}</strong> sector. Your baseline score is <strong className="text-gray-800">{overallScore}/100</strong>, indicating you have <strong className="text-gray-800">{tier === 'Digital Authority' ? 'an outstanding market posture' : 'significant avenues for authority premium'}</strong>.
              </p>

              {/* Download Report Actions */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Save / Print PDF
                </button>
                <button
                  onClick={onReset}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Audit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FIVE PILLARS SCORE MATRIX */}
        <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-2xl print:shadow-none print:border-gray-200">
          <h3 className="text-lg font-bold text-[#1A1A1A] tracking-tight mb-8 flex items-center gap-2 font-sans">
            <Sparkles className="w-5 h-5 text-[#42c28b]" />
            The 5 Pillars of Digital Authority
          </h3>

          <div className="space-y-6">
            {Object.entries(categoryResults).map(([key, item]) => {
              const pct = (item.score / item.maxScore) * 100;
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="font-bold text-sm text-gray-850 font-sans">{item.name}</span>
                      <span className="text-xs text-gray-400 font-bold ml-2 font-sans">({item.description})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-gray-900">{item.score}</span>
                      <span className="font-mono text-xs text-gray-400">/{item.maxScore}</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#42c28b]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STRENGTHS & WEAKNESSES BENTO SCREEN */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-2xl flex flex-col print:shadow-none print:border-gray-200">
            <h3 className="text-base font-bold text-[#1A1A1A] tracking-tight mb-6 flex items-center gap-2 text-[#42c28b] uppercase tracking-widest text-xs font-sans font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Identified Strengths
            </h3>
            <ul className="space-y-4 flex-1">
              {strengths.map((strength, idx) => (
                <li key={idx} className="flex gap-3 text-xs md:text-sm text-gray-650 leading-relaxed font-sans">
                  <span className="w-5 h-5 rounded-full bg-[#ecfbf3] text-[#42c28b] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-2xl flex flex-col print:shadow-none print:border-gray-200">
            <h3 className="text-base font-bold text-[#1A1A1A] tracking-tight mb-6 flex items-center gap-2 text-[#fb7474] uppercase tracking-widest text-xs font-sans font-bold">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Identified Friction
            </h3>
            <ul className="space-y-4 flex-1">
              {weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex gap-3 text-xs md:text-sm text-gray-650 leading-relaxed font-sans">
                  <span className="w-5 h-5 rounded-full bg-[#fb7474]/10 text-[#fb7474] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">!</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RECOMMENDATION CHECKS LIST */}
        <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-2xl print:shadow-none print:border-gray-200">
          <h3 className="text-lg font-bold text-[#1A1A1A] tracking-tight mb-2 font-sans">
            Personalized Priority Actions
          </h3>
          <p className="text-gray-450 text-xs mb-8">
            Complete these critical custom-tailored strategic upgrades to scale your business profile.
          </p>

          <div className="space-y-6">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 flex flex-col md:flex-row gap-6 items-start hover:border-[#42c28b]/30 transition-all duration-200"
              >
                <div className="px-3 py-1.5 rounded-lg bg-white border border-gray-100 text-[10px] font-extrabold uppercase tracking-widest text-[#42c28b] shrink-0 font-mono">
                  {rec.category}
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-bold text-[#1A1A1A] leading-relaxed font-sans">{rec.text}</p>
                  <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-bold text-[#42c28b] uppercase tracking-wider shrink-0 mt-0.5">ACTION:</span>
                    <span className="text-xs text-gray-600 font-semibold font-sans leading-relaxed">{rec.actionItem}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARTNER CTA CARD */}
        <div className="bg-gradient-to-br from-[#82e3aa]/10 via-[#81eee8]/5 to-white rounded-[40px] border border-[#42c28b]/15 p-8 sm:p-12 text-center space-y-6 print:hidden shadow-2xl">
          <span className="text-xs font-bold tracking-widest text-[#42c28b] uppercase font-mono">SCALE YOUR POSITIONING</span>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight font-sans leading-tight">
            Ready to transform your digital presence?
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto font-sans">
            Don't let your silent salesperson cost you clients. Connect with Web Design King today to construct an outstanding, high-converting digital platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleWorkWithWDK}
              className="w-full sm:w-auto px-8 py-4 bg-[#42c28b] hover:bg-[#34b07c] text-white font-bold text-base rounded-2xl transition-all duration-200 shadow-lg shadow-[#42c28b]/30 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group font-sans"
            >
              Work With Web Design King
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold text-base rounded-2xl border border-gray-100 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              Download My Audit Report
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
