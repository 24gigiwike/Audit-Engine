import { useState, useEffect } from 'react';
import { UserInfo, AuditResult } from './types';
import { incrementAnalytics, calculateAuditResult, addLead } from './utils';

import Header from './components/Header';
import LandingPage from './components/LandingPage';
import UserInformationForm from './components/UserInformationForm';
import Questionnaire from './components/Questionnaire';
import AnalysisAnimation from './components/AnalysisAnimation';
import ResultsDashboard from './components/ResultsDashboard';
import OwnerPortal from './components/OwnerPortal';

import { AnimatePresence } from 'motion/react';
import { Lock, Unlock } from 'lucide-react';

type ViewState = 'landing' | 'info' | 'questions' | 'analyzing' | 'results';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [ownerPortalOpen, setOwnerPortalOpen] = useState(false);
  const [isAdminUrl, setIsAdminUrl] = useState(false);

  // Track initial page visit and check for admin/owner in URL query parameters
  useEffect(() => {
    incrementAnalytics('pageVisits');
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('owner') === 'true') {
      setIsAdminUrl(true);
    }
  }, []);

  const handleStartAudit = () => {
    setView('info');
  };

  const handleInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setView('questions');
  };

  const handleQuestionsComplete = (finalAnswers: Record<string, number>) => {
    setAnswers(finalAnswers);
    setView('analyzing');
  };

  const handleAnalysisFinished = () => {
    if (userInfo) {
      const result = calculateAuditResult(answers, userInfo);
      setAuditResult(result);
      addLead(userInfo, result.overallScore);
      incrementAnalytics('assessmentCompletions');
      setView('results');
    }
  };

  const handleReset = () => {
    setAnswers({});
    setAuditResult(null);
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1A1A1A] flex flex-col font-sans relative overflow-x-hidden">
      <Header />

      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <LandingPage
              key="landing"
              onStart={handleStartAudit}
              onOpenOwnerPortal={() => setOwnerPortalOpen(true)}
            />
          )}

          {view === 'info' && (
            <UserInformationForm
              key="info"
              onBack={() => setView('landing')}
              onSubmit={handleInfoSubmit}
            />
          )}

          {view === 'questions' && (
            <Questionnaire
              key="questions"
              onBackToInfo={() => setView('info')}
              onComplete={handleQuestionsComplete}
            />
          )}

          {view === 'analyzing' && (
            <AnalysisAnimation
              key="analyzing"
              onFinished={handleAnalysisFinished}
            />
          )}

          {view === 'results' && (
            <ResultsDashboard
              key="results"
              result={auditResult!}
              userInfo={userInfo!}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Decorative Accents */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#fb7474]/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute -top-20 right-0 w-80 h-80 bg-[#fbf6bc]/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Slide-over Owner Portal drawer */}
      <AnimatePresence>
        {ownerPortalOpen && (
          <OwnerPortal key="owner-portal" onClose={() => setOwnerPortalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Secret Floating Admin Button */}
      {isAdminUrl && (
        <button
          onClick={() => setOwnerPortalOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3 bg-white border border-gray-100 rounded-full shadow-lg hover:shadow-xl hover:text-[#42c28b] transition-all duration-300 cursor-pointer flex items-center justify-center text-gray-400 group"
          title="Access Owner Portal"
        >
          <Lock className="w-4 h-4 group-hover:hidden" />
          <Unlock className="w-4 h-4 hidden group-hover:block text-[#42c28b]" />
        </button>
      )}
    </div>
  );
}
