import { AuditResult, UserInfo, AnalyticsData } from './types';
import { AUDIT_QUESTIONS } from './data';

export function calculateAuditResult(
  answers: Record<string, number>,
  userInfo: UserInfo
): AuditResult {
  // Group questions by category
  const clarityIds = AUDIT_QUESTIONS.filter((q) => q.category === 'clarity').map((q) => q.id);
  const trustIds = AUDIT_QUESTIONS.filter((q) => q.category === 'trust').map((q) => q.id);
  const visualIds = AUDIT_QUESTIONS.filter((q) => q.category === 'visual').map((q) => q.id);
  const conversionIds = AUDIT_QUESTIONS.filter((q) => q.category === 'conversion').map((q) => q.id);
  const growthIds = AUDIT_QUESTIONS.filter((q) => q.category === 'growth').map((q) => q.id);

  // Compute raw scores
  const getSum = (ids: string[]) => ids.reduce((sum, id) => sum + (answers[id] || 2), 0);

  const rawClarity = getSum(clarityIds); // max 30
  const rawTrust = getSum(trustIds);     // max 20
  const rawVisual = getSum(visualIds);   // max 20
  const rawConversion = getSum(conversionIds); // max 20
  const rawGrowth = getSum(growthIds);   // max 20

  // Scale each to 20 points
  const scoreClarity = Math.round((rawClarity / 30) * 20);
  const scoreTrust = Math.round((rawTrust / 20) * 20);
  const scoreVisual = Math.round((rawVisual / 20) * 20);
  const scoreConversion = Math.round((rawConversion / 20) * 20);
  const scoreGrowth = Math.round((rawGrowth / 20) * 20);

  const overallScore = Math.min(100, scoreClarity + scoreTrust + scoreVisual + scoreConversion + scoreGrowth);

  // Determine Rating Tier
  let tier: AuditResult['tier'] = 'Needs Strategic Refinement';
  if (overallScore >= 90) tier = 'Digital Authority';
  else if (overallScore >= 70) tier = 'Strong Foundation';
  else if (overallScore >= 50) tier = 'Hidden Potential';

  const getRating = (score: number) => {
    if (score >= 17) return { label: 'Elite', desc: 'World-class positioning.' };
    if (score >= 13) return { label: 'Strong', desc: 'Well established with minor gaps.' };
    if (score >= 9) return { label: 'Moderate', desc: 'Solid starting point but underperforming.' };
    return { label: 'Critical', desc: 'Action required immediately.' };
  };

  const clarityRating = getRating(scoreClarity);
  const trustRating = getRating(scoreTrust);
  const visualRating = getRating(scoreVisual);
  const conversionRating = getRating(scoreConversion);
  const growthRating = getRating(scoreGrowth);

  const categoryResults: Record<string, any> = {
    clarity: {
      name: 'Brand Clarity',
      score: scoreClarity,
      maxScore: 20,
      rating: clarityRating.label,
      description: clarityRating.desc,
    },
    trust: {
      name: 'Trust & Credibility',
      score: scoreTrust,
      maxScore: 20,
      rating: trustRating.label,
      description: trustRating.desc,
    },
    visual: {
      name: 'Visual Experience',
      score: scoreVisual,
      maxScore: 20,
      rating: visualRating.label,
      description: visualRating.desc,
    },
    conversion: {
      name: 'Conversion System',
      score: scoreConversion,
      maxScore: 20,
      rating: conversionRating.label,
      description: conversionRating.desc,
    },
    growth: {
      name: 'Growth Foundation',
      score: scoreGrowth,
      maxScore: 20,
      rating: growthRating.label,
      description: growthRating.desc,
    },
  };

  // Generate customized lists of strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: AuditResult['recommendations'] = [];

  const ind = userInfo.industry;

  // Clarity assessment
  if (scoreClarity >= 16) {
    strengths.push(`Excellent messaging clarity! Within 5 seconds, prospective ${ind} clients understand exactly what you do.`);
  } else {
    weaknesses.push(`Positioning is slightly ambiguous. Visitors might struggle to instantly distinguish your ${ind} services from standard generalists.`);
    recommendations.push({
      category: 'Brand Clarity',
      text: `Your brand messaging may focus more on skills/features than the final value. Elevate your value proposition to highlight client transformations.`,
      actionItem: `Rewrite your hero section layout using the "Web Design King Outcome Blueprint": [Target Client] + [Pain Point Solved] + [Quantifiable Business Benefit].`,
    });
  }

  // Trust assessment
  if (scoreTrust >= 16) {
    strengths.push('Stellar credibility stack. You leverage deep testimonials or proof elements that instantly dismantle client skepticism.');
  } else {
    weaknesses.push('Insufficient trust validation. A beautiful portfolio with no metrics or detailed client success case studies limits your high-ticket potential.');
    recommendations.push({
      category: 'Trust & Credibility',
      text: `Clients buy results, not just services. Transition from a "gallery of work" to a "case studies hub" showcasing clear problem-solution-outcome arcs.`,
      actionItem: `Pick 2 past projects and format them into a 3-part case study: (1) The Challenge, (2) Your Strategic Solution, (3) The Business Impact or ROI achieved.`,
    });
  }

  // Visual Experience assessment
  if (scoreVisual >= 16) {
    strengths.push('Premium visual polish. Your layout aesthetic immediately validates your authority and commands premium pricing.');
  } else {
    weaknesses.push(`Visual representation doesn't match the level of your actual work. Design inconsistencies or lack of responsive optimization could create friction.`);
    recommendations.push({
      category: 'Visual Experience',
      text: `First impressions are deeply visual. Ensure your typography hierarchies, spacing rules, and color palettes are consistent across all platforms.`,
      actionItem: `Incorporate a cohesive, light-themed premium design grid system with subtle modern borders, spacious margins, and standard typography like Poppins.`,
    });
  }

  // Conversion System assessment
  if (scoreConversion >= 16) {
    strengths.push('Highly optimized client acquisition funnel. It is clear, friction-free, and drives visitors directly to take action.');
  } else {
    weaknesses.push('Under-optimized conversion systems. There are too many choices or lack of clear pathways for a high-intent prospect to start working with you.');
    recommendations.push({
      category: 'Conversion System',
      text: `Prospects require a clear, effortless journey. A static contact page or generic 'Let's chat' email link creates a visual bottleneck.`,
      actionItem: `Set up a direct, automated booking form (like Calendly) on a clean, styled booking card with a prominent primary CTA button.`,
    });
  }

  // Growth Foundation assessment
  if (scoreGrowth >= 16) {
    strengths.push('Reliable, proactive growth engine. You are building long-term equity through audience development and regular outreach.');
  } else {
    weaknesses.push('Unpredictable client pipeline. Relying solely on passive word-of-mouth or reactive referrals leaves your growth vulnerable to dry spells.');
    recommendations.push({
      category: 'Growth Foundation',
      text: `Establish a systematic way to attract attention and stay top-of-mind. Building an email list or publishing authority content is key.`,
      actionItem: `Create a simple lead-magnet (e.g., an industry checklist or mini-guide) or commit to publishing 1 key piece of strategic content weekly.`,
    });
  }

  // Ensure we always have at least 2 strengths and weaknesses for professional visual presentation
  if (strengths.length === 0) {
    strengths.push(`Highly motivated to scale. You have set up a solid base to implement the recommended enhancements.`);
    strengths.push(`Open to strategic growth. Completing this audit demonstrates a premium commitment to business refinement.`);
  }
  if (strengths.length === 1) {
    strengths.push(`Solid baseline capability. You have established fundamental ${ind} services that can be scaled.`);
  }

  if (weaknesses.length === 0) {
    weaknesses.push(`Scaling complexity. Highly optimized systems can still experience micro-bottlenecks as client volume expands.`);
    weaknesses.push(`Audience saturation. When everything is perfect, the next challenge is scaling marketing to tap into entirely new audiences.`);
  }
  if (weaknesses.length === 1) {
    weaknesses.push(`Automation headroom. There is room to further delegate repetitive intake questions using smart forms.`);
  }

  return {
    overallScore,
    categoryResults,
    tier,
    strengths,
    weaknesses,
    recommendations,
  };
}

// Helpers for Local Storage Lead Capture & Analytics
const ANALYTICS_KEY = 'wdk_digital_presence_audit_analytics';

export function getAnalytics(): AnalyticsData {
  const data = localStorage.getItem(ANALYTICS_KEY);
  if (!data) {
    const initial: AnalyticsData = {
      pageVisits: 1, // Start with 1 on first load
      assessmentStarts: 0,
      assessmentCompletions: 0,
      ctaClicks: 0,
      leads: [],
    };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return {
      pageVisits: 1,
      assessmentStarts: 0,
      assessmentCompletions: 0,
      ctaClicks: 0,
      leads: [],
    };
  }
}

export function incrementAnalytics(metric: 'pageVisits' | 'assessmentStarts' | 'assessmentCompletions' | 'ctaClicks'): void {
  const current = getAnalytics();
  current[metric] = (current[metric] || 0) + 1;
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(current));
}

export function addLead(userInfo: UserInfo, score: number): void {
  const current = getAnalytics();
  const timestamp = new Date().toISOString();
  // Avoid duplicate leads by email in the log
  const index = current.leads.findIndex((l) => l.email === userInfo.email);
  const leadData = { ...userInfo, timestamp, score };
  if (index >= 0) {
    current.leads[index] = leadData;
  } else {
    current.leads.push(leadData);
  }
  // Also make sure completions count incremented
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(current));

  // Trigger webhook if configured
  const webhookUrl = localStorage.getItem('wdk_lead_webhook_url');
  if (webhookUrl) {
    let url = webhookUrl.trim();
    if (url.startsWith('http://')) {
      url = 'https://' + url.slice(7);
    }

    const payload = {
      event: 'new_lead',
      timestamp,
      lead: leadData,
      source: 'Web Design King Digital Audit Engine',
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          console.warn(`Webhook responded with status ${res.status}`);
        }
      })
      .catch((err) => {
        console.warn('Standard webhook fetch failed. Attempting no-cors fallback...', err);
        // Fallback to no-cors mode in case of browser-level CORS block
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(payload),
        }).catch((fallbackErr) => {
          console.error('Fallback webhook fetch failed:', fallbackErr);
        });
      });
  }
}
