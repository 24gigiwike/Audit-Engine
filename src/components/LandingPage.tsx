import { ArrowRight, CheckCircle2, ShieldCheck, Eye, Zap, TrendingUp, Users, Award, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { incrementAnalytics } from '../utils';

interface LandingPageProps {
  onStart: () => void;
  onOpenOwnerPortal: () => void;
  key?: string;
}

export default function LandingPage({ onStart, onOpenOwnerPortal }: LandingPageProps) {
  const handleStartAudit = () => {
    incrementAnalytics('assessmentStarts');
    onStart();
  };

  const handleCtaClick = () => {
    incrementAnalytics('ctaClicks');
    handleStartAudit();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FBFBFA] min-h-screen selection:bg-[#82e3aa]/20 selection:text-gray-900 font-sans">
      
      {/* HERO / INTRO SECTION */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 px-6 max-w-7xl mx-auto overflow-hidden">
        
        {/* Subtle, soft light background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#81eee8]/10 via-[#fbf6bc]/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-br from-[#82e3aa]/10 via-[#fb7474]/5 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Confident Left Column: Large typography, asymmetrical spacing */}
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#81eee8]/10 border border-[#42c28b]/20 text-[#42c28b] rounded-full text-xs font-bold tracking-widest uppercase"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#42c28b] animate-pulse" />
                <span>Free Digital Presence Audit</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight"
              >
                How strong is your <span className="text-[#42c28b] relative inline-block">
                  digital presence
                  <span className="absolute left-0 bottom-1 w-full h-1 bg-[#82e3aa] opacity-40 rounded-full" />
                </span>?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-500 font-normal leading-relaxed max-w-xl"
              >
                A strategic audit that reveals how your brand is perceived online and what can improve your ability to attract opportunities.
              </motion.p>
            </div>

            {/* Hero Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <button
                onClick={handleStartAudit}
                className="w-full sm:w-auto px-8 py-4 bg-[#42c28b] hover:bg-[#34b07c] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#42c28b]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-250 cursor-pointer flex items-center justify-center gap-2 group"
              >
                Start Your Free Audit
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold text-base rounded-2xl border border-gray-100 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
              >
                See How It Works
              </button>
            </motion.div>

            {/* Asymmetrical Trust Card - Clean, Bright, Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="p-6 bg-white border border-gray-100/80 rounded-3xl shadow-sm max-w-lg mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex -space-x-3 shrink-0">
                <div className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-[#81eee8] to-[#42c28b] flex items-center justify-center text-white text-[10px] font-bold">A</div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-[#fb7474] to-[#fbf6bc] flex items-center justify-center text-white text-[10px] font-bold">M</div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-[#42c28b] to-[#82e3aa] flex items-center justify-center text-white text-[10px] font-bold">J</div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Premium Verification</p>
                <p className="text-sm text-gray-600 font-medium italic leading-relaxed">
                  "This strategic audit transformed how we package our values and close high-ticket agency opportunities."
                </p>
              </div>
            </motion.div>

          </div>

          {/* Interactive Mockup Column - Styled like a high-end consultation workspace */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={handleStartAudit}
              className="bg-white border border-gray-100 rounded-[40px] shadow-2xl p-8 md:p-10 flex flex-col justify-between relative cursor-pointer group hover:border-[#42c28b]/30 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute top-10 right-10 flex space-x-1.5">
                <div className="h-1 w-8 bg-[#42c28b] rounded-full"></div>
                <div className="h-1 w-8 bg-gray-100 rounded-full"></div>
                <div className="h-1 w-8 bg-gray-100 rounded-full"></div>
                <div className="h-1 w-8 bg-gray-100 rounded-full"></div>
              </div>

              <div className="space-y-8">
                <span className="text-[#42c28b] font-bold tracking-widest text-[10px] uppercase font-mono">
                  Consultation Preview — Step 01
                </span>
                
                <h3 className="text-2xl font-bold leading-snug text-[#1A1A1A]">
                  Can someone understand what you do within 5 seconds of seeing your profile?
                </h3>
                
                <div className="space-y-3.5">
                  <div className="w-full text-left p-4 rounded-2xl border-2 border-[#42c28b] bg-[#82e3aa]/5 flex items-center justify-between transition-all duration-200">
                    <div>
                      <p className="font-bold text-sm text-gray-900">Yes, my unique value is immediately clear</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-normal">Our headlines focus strictly on core client outcomes.</p>
                    </div>
                    <div className="w-5.5 h-5.5 rounded-full bg-[#42c28b] flex items-center justify-center shrink-0 ml-3">
                      <svg className="w-3.5 h-3.5 text-white stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="w-full text-left p-4 rounded-2xl border border-gray-100 group-hover:border-[#82e3aa]/30 bg-white flex items-center justify-between transition-all duration-200">
                    <div>
                      <p className="font-bold text-sm text-gray-700">They understand my skill, but not my difference</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-normal">We blend in with standard general service providers.</p>
                    </div>
                  </div>

                  <div className="w-full text-left p-4 rounded-2xl border border-gray-100 bg-white flex items-center justify-between transition-all duration-200">
                    <div>
                      <p className="font-bold text-sm text-gray-700">We have to manually explain our services</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-normal">The page is focused heavily on visual or tech specs.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-50">
                <p className="text-xs text-gray-400 font-bold italic font-mono">Question 1 of 11</p>
                <button className="px-6 py-3 bg-[#42c28b] hover:bg-[#34b07c] text-white font-bold text-xs rounded-xl shadow-md shadow-[#42c28b]/20 group-hover:scale-105 active:scale-95 transition-all uppercase tracking-wider">
                  Take Audit
                </button>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Horizontal flow line indicator */}
        <div className="border-t border-gray-100 pt-8 mt-20">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-5">
            Engineered for high-performing modern teams
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-gray-500 text-xs font-bold">
            <span className="hover:text-[#42c28b] transition-colors cursor-pointer">Design Studios</span>
            <span className="text-gray-200">•</span>
            <span className="hover:text-[#42c28b] transition-colors cursor-pointer">Software Developers</span>
            <span className="text-gray-200">•</span>
            <span className="hover:text-[#42c28b] transition-colors cursor-pointer">Freelance Creators</span>
            <span className="text-gray-200">•</span>
            <span className="hover:text-[#42c28b] transition-colors cursor-pointer">Digital Agencies</span>
            <span className="text-gray-200">•</span>
            <span className="hover:text-[#42c28b] transition-colors cursor-pointer">Independent Consultants</span>
          </div>
        </div>

      </section>

      {/* HOW IT WORKS - Editorial, Asymmetrical Spacing */}
      <section id="how-it-works" className="py-24 md:py-32 bg-[#FBFBFA] border-y border-gray-100/60 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#42c28b] uppercase font-mono">The Blueprint</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight">
              A Simple 3-Step Strategic Framework
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              We evaluate five essential pillars of online authority in less than 5 minutes. No complex setup or technical jargon required.
            </p>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Intake and Context',
                desc: 'Answer a few curated prompts reflecting your client interaction models, values, and branding.',
              },
              {
                num: '02',
                title: 'Authority Matrix',
                desc: 'Generate a precise score from 1-100 detailing performance across critical growth and clarity variables.',
              },
              {
                num: '03',
                title: 'Actionable Upgrades',
                desc: 'Obtain curated, actionable recommendations designed to refine client conversion patterns instantly.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm relative group hover:border-[#82e3aa]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="text-5xl font-extrabold text-[#42c28b]/10 absolute top-6 right-6 select-none group-hover:text-[#42c28b]/20 transition-colors font-mono">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-3 mt-4 leading-tight">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-normal">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* WHAT YOU RECEIVE - Large content blocks, Thin borders */}
      <section className="py-24 md:py-32 bg-[#FBFBFA] px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest text-[#42c28b] uppercase font-mono">Detailed Analysis</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
                What we analyze in your comprehensive report
              </h2>
            </div>
            <p className="text-gray-500 text-base max-w-md leading-relaxed">
              Every detail is meticulously assessed to structure an exhaustive map of your brand's digital perception.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle2 className="w-5 h-5 text-[#42c28b]" />,
                title: 'Brand Clarity',
                desc: 'Do visitors grasp your core service within the critical first 5 seconds, or do you lose potential clients?',
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-[#42c28b]" />,
                title: 'Trust & Validation',
                desc: 'How robustly do your case studies, feedback loops, and metrics reinforce your client results?',
              },
              {
                icon: <Eye className="w-5 h-5 text-[#42c28b]" />,
                title: 'Visual Experience',
                desc: 'Evaluate if your styling, typography choices, and layout standards match the premium value of your work.',
              },
              {
                icon: <Zap className="w-5 h-5 text-[#42c28b]" />,
                title: 'Conversion Pipelines',
                desc: 'Determine if potential clients have seamless, direct booking models and conversion paths.',
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-[#42c28b]" />,
                title: 'Growth Magnets',
                desc: 'Assess the strength of your passive list building systems, value offers, and social authority.',
              },
              {
                icon: <Award className="w-5 h-5 text-[#42c28b]" />,
                title: 'Bespoke Checklist',
                desc: 'A tailored, highly actionable set of recommendations mapped directly to your targeted workspace.',
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="p-8 rounded-[30px] border border-gray-100 bg-white/50 hover:bg-white hover:border-[#82e3aa]/30 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100/60 mb-6">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-normal">{benefit.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* AUDIENCE FOCUS - Asymmetrical, breathe */}
      <section className="py-24 md:py-32 bg-[#FBFBFA] border-t border-gray-100/60 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#42c28b] uppercase font-mono">Designed For</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
              Tailored For Modern Independent Creators & Studios
            </h2>
            <p className="text-gray-500 text-base">
              The metrics scale dynamically based on your targeted audience and delivery models.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: 'Independent Freelancers',
                detail: 'Copywriters, developers, designers, and consultants looking to elevate positioning and land higher retainers.',
              },
              {
                role: 'Boutique Agencies',
                detail: 'Creative studios and software groups looking to unify their outbound branding and increase trust matrices.',
              },
              {
                role: 'Expert Creators',
                detail: 'Educators and creators seeking to package intellectual assets and command authority.',
              },
              {
                role: 'Digital Strategists',
                detail: 'Marketing advisors, growth consultants, and startup founders demanding absolute clarity in their profile.',
              },
            ].map((audience, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[30px] border border-gray-100 hover:border-[#42c28b]/20 transition-all duration-300 flex flex-col"
              >
                <div className="w-8 h-8 rounded-lg bg-[#82e3aa]/10 text-[#42c28b] flex items-center justify-center font-bold text-sm mb-6">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] text-base mb-2">{audience.role}</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-normal">{audience.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE FINAL CALL - Premium Bento-Style */}
      <section className="py-28 bg-[#FBFBFA] relative overflow-hidden px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-white border border-gray-100 p-10 sm:p-16 rounded-[40px] shadow-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#82e3aa]/10 rounded-full text-[10px] font-bold text-[#42c28b] uppercase tracking-widest font-mono mx-auto">
            Ready to scale?
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
            Ready to discover your <span className="text-[#42c28b]">Digital Authority</span> score?
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
            Stop guessing how visitors view your credentials. Take the strategic digital audit today and construct high-conversion profile frameworks.
          </p>
          <div className="pt-4">
            <button
              onClick={handleCtaClick}
              className="px-10 py-5 bg-[#42c28b] hover:bg-[#34b07c] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#42c28b]/25 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer inline-flex items-center gap-3.5"
            >
              Take Your Free Audit
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-[#FBFBFA] py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2.5">
            <img 
              src="https://res.cloudinary.com/dtkluxukm/image/upload/v1781877708/8_cwwfre.png" 
              alt="Audit Engine Logo"
              className="h-8 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-extrabold text-gray-900 tracking-wide uppercase text-xs">
              WEB DESIGN <span className="text-[#42c28b]">KING</span>
            </span>
            <span className="text-gray-200 font-normal">|</span>
            <span className="text-xs font-bold text-gray-400 tracking-wider">Audit Engine™</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
            <a
              href="https://instagram.com/webdesignking_"
              target="_blank"
              rel="noreferrer"
              referrerPolicy="no-referrer"
              className="hover:text-[#42c28b] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://youtube.com/@webdesignkinging"
              target="_blank"
              rel="noreferrer"
              referrerPolicy="no-referrer"
              className="hover:text-[#42c28b] transition-colors"
            >
              YouTube
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                incrementAnalytics('ctaClicks');
                window.open('https://www.webdesignking.online', '_blank');
              }}
              className="text-[#1A1A1A] hover:text-[#42c28b] font-bold transition-colors flex items-center gap-1"
            >
              Official Website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Web Design King. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
