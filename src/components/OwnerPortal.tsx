import { useState, useEffect, FormEvent } from 'react';
import { getAnalytics, incrementAnalytics, getFirebaseAnalytics, clearFirebaseAnalytics } from '../utils';
import { AnalyticsData } from '../types';
import { X, Search, Download, Trash2, Calendar, Mail, Star, Users, KeyRound, Check, AlertCircle, Send, Radio, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface OwnerPortalProps {
  onClose: () => void;
  key?: string;
}

export default function OwnerPortal({ onClose }: OwnerPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('wdk_is_authenticated') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('wdk_lead_webhook_url') || '';
  });
  const [saveStatus, setSaveStatus] = useState('');
  const [testStatus, setTestStatus] = useState('');

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageVisits: 0,
    assessmentStarts: 0,
    assessmentCompletions: 0,
    ctaClicks: 0,
    leads: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = () => {
    setIsRefreshing(true);
    getFirebaseAnalytics()
      .then((data) => {
        setAnalytics(data);
      })
      .catch((err) => {
        console.error('Failed to sync analytics:', err);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

  const handlePasscodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin' || passcode === 'wdk2026' || passcode.toLowerCase() === 'king') {
      setIsAuthenticated(true);
      sessionStorage.setItem('wdk_is_authenticated', 'true');
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid passcode. Access Denied.');
    }
  };

  const handleSaveWebhook = () => {
    let url = webhookUrl.trim();
    if (url.startsWith('http://')) {
      url = 'https://' + url.slice(7);
      setWebhookUrl(url);
    }
    localStorage.setItem('wdk_lead_webhook_url', url);
    setSaveStatus('Webhook URL saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleTestWebhook = () => {
    if (!webhookUrl) return;
    setTestStatus('Sending test payload...');

    let url = webhookUrl.trim();
    if (url.startsWith('http://')) {
      url = 'https://' + url.slice(7);
      setWebhookUrl(url);
    }

    const payload = {
      event: 'test_lead',
      timestamp: new Date().toISOString(),
      lead: {
        name: 'Jane Doe (Test Lead)',
        email: 'jane.doe@example.com',
        industry: 'E-commerce',
        website: 'https://www.example.com',
        social: '@janedoe',
        score: 85,
      },
      message: 'Hello! This is a test event from your Web Design King Lead Engine.',
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok || res.status === 200 || res.status === 201) {
          setTestStatus('Test sent successfully! Check Zapier / Make.');
        } else {
          setTestStatus(`Test sent, but server responded with status: ${res.status}`);
        }
        setTimeout(() => setTestStatus(''), 6000);
      })
      .catch((err) => {
        console.warn('Standard test dispatch failed. Retrying with no-cors mode...', err);
        setTestStatus('Retrying with no-cors mode bypass...');
        
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(payload),
        })
          .then(() => {
            setTestStatus('Dispatched test payload via CORS-bypass mode! Please check Zapier / Make.');
            setTimeout(() => setTestStatus(''), 8000);
          })
          .catch((fallbackErr) => {
            setTestStatus(`Test dispatch failed completely: ${fallbackErr.message || fallbackErr}`);
            setTimeout(() => setTestStatus(''), 8000);
          });
      });
  };

  const handleClearAnalytics = () => {
    if (confirm('Are you sure you want to reset all tracking metrics and delete all leads from both local cache and Firestore cloud? This action cannot be undone.')) {
      setIsRefreshing(true);
      clearFirebaseAnalytics()
        .then(() => {
          localStorage.removeItem('wdk_digital_presence_audit_analytics');
          setAnalytics({
            pageVisits: 0,
            assessmentStarts: 0,
            assessmentCompletions: 0,
            ctaClicks: 0,
            leads: [],
          });
        })
        .catch((err) => {
          console.error('Failed to clear cloud analytics:', err);
          alert('Could not clear Firestore analytics. Please check network connection.');
        })
        .finally(() => {
          setIsRefreshing(false);
        });
    }
  };

  // Export leads as CSV file
  const handleExportCSV = () => {
    incrementAnalytics('ctaClicks');
    const leads = analytics.leads;
    if (leads.length === 0) {
      alert('No leads captured yet to export.');
      return;
    }

    const headers = ['Name', 'Email', 'Industry', 'Website', 'Social', 'Audit Score', 'Timestamp'];
    const rows = leads.map((lead) => [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.email.replace(/"/g, '""')}"`,
      `"${lead.industry}"`,
      `"${(lead.website || '').replace(/"/g, '""')}"`,
      `"${(lead.social || '').replace(/"/g, '""')}"`,
      lead.score,
      lead.timestamp,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = analytics.leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.industry.toLowerCase().includes(term)
    );
  });

  // Calculate percentages
  const startRate = analytics.pageVisits > 0 ? Math.round((analytics.assessmentStarts / analytics.pageVisits) * 100) : 0;
  const completionRate = analytics.assessmentStarts > 0 ? Math.round((analytics.assessmentCompletions / analytics.assessmentStarts) * 100) : 0;
  const ctaClickRate = analytics.assessmentCompletions > 0 ? Math.round((analytics.ctaClicks / analytics.assessmentCompletions) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-50 flex justify-end selection:bg-[#82e3aa]/20 selection:text-gray-900">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 24, stiffness: 120 }}
        className="w-full max-w-4xl bg-white h-full shadow-3xl flex flex-col font-sans"
      >
        {/* Drawer Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#42c28b]/10 border border-[#42c28b]/20 flex items-center justify-center font-bold text-[#42c28b]">
              🔒
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg tracking-tight">Owner Portal</h3>
              <p className="text-xs text-gray-400 font-bold tracking-wide uppercase font-mono">Real-time Acquisition Insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={fetchAnalytics}
                disabled={isRefreshing}
                className="w-9 h-9 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#42c28b] transition-colors cursor-pointer border border-gray-100/50 disabled:opacity-50"
                title="Refresh Cloud Data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#42c28b]' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer border border-gray-100/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body or Password Gate */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#42c28b]/5 border border-[#42c28b]/15 flex items-center justify-center text-[#42c28b] shadow-sm">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-xl tracking-tight">Enter Access Passkey</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">This portal is secure and only accessible by Web Design King administrators.</p>
            </div>
            <form onSubmit={handlePasscodeSubmit} className="w-full space-y-4">
              <div className="space-y-1.5 text-left">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError('');
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 text-center bg-[#FBFBFA] focus:bg-white rounded-xl border border-gray-100 focus:border-[#42c28b] focus:ring-4 focus:ring-[#42c28b]/5 outline-none transition-all duration-200 text-gray-900 text-lg tracking-widest font-mono"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-xs text-[#fb7474] font-bold mt-1.5 text-center flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {passcodeError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#42c28b] hover:bg-[#34b07c] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-[#42c28b]/10"
              >
                Access Portal
              </button>
            </form>
            <p className="text-[10px] text-gray-400 font-bold font-mono uppercase tracking-wider">
              Protected by Audit Engine™ Guard
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            
            {/* STATS TILES GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Page Visits', val: analytics.pageVisits, desc: 'Total traffic', color: 'text-gray-900 bg-gray-50/70 border border-gray-100' },
                { label: 'Audits Started', val: analytics.assessmentStarts, desc: `Engagement: ${startRate}%`, color: 'text-[#42c28b] bg-[#42c28b]/5 border border-[#42c28b]/10' },
                { label: 'Completions', val: analytics.assessmentCompletions, desc: `Complete rate: ${completionRate}%`, color: 'text-[#42c28b] bg-[#82e3aa]/8 border border-[#82e3aa]/10' },
                { label: 'CTA Clicks', val: analytics.ctaClicks, desc: `Conversion: ${ctaClickRate}%`, color: 'text-[#fb7474] bg-[#fb7474]/5 border border-[#fb7474]/10' },
              ].map((stat, idx) => (
                <div key={idx} className={`p-5 rounded-2xl flex flex-col ${stat.color}`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">{stat.label}</span>
                  <span className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">{stat.val}</span>
                  <span className="text-[10px] text-gray-500 font-semibold mt-1">{stat.desc}</span>
                </div>
              ))}
            </div>

            {/* WEBHOOK NOTIFICATIONS INTEGRATION */}
            <div className="bg-[#FBFBFA] rounded-[24px] border border-gray-100 p-6 md:p-8 space-y-5">
              <div>
                <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <Radio className="w-5 h-5 text-[#42c28b] animate-pulse" />
                  Real-time Lead Notifications (Webhook)
                </h4>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Connect lead captures instantly to your Email, CRM, Slack, Discord, or Google Sheets using Zapier, Make.com, or custom webhooks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => {
                    setWebhookUrl(e.target.value);
                    setSaveStatus('');
                  }}
                  placeholder="e.g. https://hooks.zapier.com/hooks/catch/..."
                  className="flex-1 px-4 py-3 text-xs bg-white rounded-xl border border-gray-200 focus:border-[#42c28b] focus:ring-4 focus:ring-[#42c28b]/5 outline-none transition-all duration-200 text-gray-900 font-mono"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveWebhook}
                    className="px-5 py-3 bg-[#1a1a1a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleTestWebhook}
                    disabled={!webhookUrl}
                    className="px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Test
                  </button>
                </div>
              </div>

              {saveStatus && (
                <p className="text-xs text-[#42c28b] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 font-bold" /> {saveStatus}
                </p>
              )}

              {testStatus && (
                <p className={`text-xs font-bold flex items-center gap-1 ${testStatus.toLowerCase().includes('failed') ? 'text-[#fb7474]' : 'text-[#42c28b]'}`}>
                  {testStatus.toLowerCase().includes('failed') ? <AlertCircle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 animate-bounce" />}
                  {testStatus}
                </p>
              )}

              <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-1.5 text-[11px] text-gray-500 font-medium leading-relaxed">
                <p className="font-bold text-gray-700 uppercase tracking-wider text-[9px] font-mono mb-1">Quick Integration Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Create a free trigger at <a href="https://zapier.com" target="_blank" rel="noreferrer" className="text-[#42c28b] font-bold hover:underline">Zapier.com</a> or <a href="https://make.com" target="_blank" rel="noreferrer" className="text-[#42c28b] font-bold hover:underline">Make.com</a> (choose "Webhooks / Catch Hook").</li>
                  <li>Copy their Webhook URL and paste it into the field above, then click <strong>Save</strong>.</li>
                  <li>Click <strong>Test</strong> above to dispatch a dummy payload.</li>
                  <li>Map the fields (name, email, industry, score) in your automation to instantly forward leads to your inbox or Google Sheets!</li>
                </ol>
              </div>
            </div>

            {/* LEADS SECTION */}
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#42c28b]" />
                    Captured Leads ({filteredLeads.length})
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">Strategic digital presence assessment prospects</p>
                </div>

                {/* CSV Export & Clear Data */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 bg-[#42c28b] hover:bg-[#34b07c] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#42c28b]/10"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                  <button
                    onClick={handleClearAnalytics}
                    className="w-10 h-10 border border-gray-100 hover:border-[#fb7474] rounded-xl hover:bg-[#fb7474]/5 text-gray-400 hover:text-[#fb7474] transition-colors flex items-center justify-center cursor-pointer"
                    title="Clear all statistics and logs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SEARCH */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search leads by name, email, or industry..."
                  className="w-full pl-10 pr-4 py-3 text-xs bg-[#FBFBFA] focus:bg-white rounded-xl border border-gray-100 focus:border-[#42c28b] focus:ring-4 focus:ring-[#42c28b]/5 outline-none transition-all duration-200 text-gray-900 font-medium"
                />
              </div>

              {/* LEADS LIST / TABLE */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                {filteredLeads.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 text-sm font-medium">
                    No prospects matched the search filter or none have completed the audit yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FBFBFA] border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px] font-mono">
                          <th className="p-4 pl-6">Prospect Info</th>
                          <th className="p-4">Industry</th>
                          <th className="p-4">Score</th>
                          <th className="p-4">Links</th>
                          <th className="p-4 pr-6">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredLeads.map((lead, idx) => (
                          <tr key={idx} className="hover:bg-[#FBFBFA]/40 transition-colors">
                            <td className="p-4 pl-6 space-y-1">
                              <p className="font-bold text-gray-950 font-sans">{lead.name}</p>
                              <p className="text-gray-400 font-semibold flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> {lead.email}
                              </p>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 font-bold uppercase text-[10px] tracking-wide font-mono">
                                {lead.industry}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-[#42c28b] fill-[#42c28b]" />
                                <span className="font-extrabold text-gray-950 font-mono text-sm">{lead.score}</span>
                              </div>
                            </td>
                            <td className="p-4 space-y-1 text-gray-500 font-semibold">
                              {lead.website ? (
                                <a
                                  href={lead.website}
                                  target="_blank"
                                  referrerPolicy="no-referrer"
                                  className="hover:text-[#42c28b] flex items-center gap-1 transition-colors"
                                >
                                  🌐 Website
                                </a>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                              {lead.social && (
                                <p className="text-gray-400 truncate max-w-[140px] font-medium" title={lead.social}>
                                  🔗 {lead.social}
                                </p>
                              )}
                            </td>
                            <td className="p-4 pr-6 text-gray-400 font-semibold flex items-center gap-1.5 mt-2">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(lead.timestamp).toLocaleDateString()} {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
}
