import { AuditResult, UserInfo, AnalyticsData } from './types';
import { AUDIT_QUESTIONS } from './data';
import { db } from './lib/firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, increment } from 'firebase/firestore';

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
  }

  // Trust assessment
  if (scoreTrust >= 16) {
    strengths.push('Stellar credibility stack. You leverage deep testimonials or proof elements that instantly dismantle client skepticism.');
  } else {
    weaknesses.push('Insufficient trust validation. A beautiful portfolio with no metrics or detailed client success case studies limits your high-ticket potential.');
  }

  // Visual Experience assessment
  if (scoreVisual >= 16) {
    strengths.push('Premium visual polish. Your layout aesthetic immediately validates your authority and commands premium pricing.');
  } else {
    weaknesses.push(`Visual representation doesn't match the level of your actual work. Design inconsistencies or lack of responsive optimization could create friction.`);
  }

  // Conversion System assessment
  if (scoreConversion >= 16) {
    strengths.push('Highly optimized client acquisition funnel. It is clear, friction-free, and drives visitors directly to take action.');
  } else {
    weaknesses.push('Under-optimized conversion systems. There are too many choices or lack of clear pathways for a high-intent prospect to start working with you.');
  }

  // Growth Foundation assessment
  if (scoreGrowth >= 16) {
    strengths.push('Reliable, proactive growth engine. You are building long-term equity through audience development and regular outreach.');
  } else {
    weaknesses.push('Unpredictable client pipeline. Relying solely on passive word-of-mouth or reactive referrals leaves your growth vulnerable to dry spells.');
  }

  // Create an array of the 5 categories with their scores and analytical metadata
  const cats = [
    { key: 'clarity', name: 'Brand Clarity', score: scoreClarity },
    { key: 'trust', name: 'Trust & Credibility', score: scoreTrust },
    { key: 'visual', name: 'Visual Experience', score: scoreVisual },
    { key: 'conversion', name: 'Conversion System', score: scoreConversion },
    { key: 'growth', name: 'Growth Foundation', score: scoreGrowth },
  ];

  // Sort them so that the lowest scoring categories are selected first
  const order = ['clarity', 'trust', 'visual', 'conversion', 'growth'];
  cats.sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score;
    }
    return order.indexOf(a.key) - order.indexOf(b.key);
  });

  // Take top 3 lowest-scoring categories to generate as Top 3 Priority Actions
  const top3 = cats.slice(0, 3);
  const priorities: ('HIGH' | 'MEDIUM' | 'LOW')[] = ['HIGH', 'MEDIUM', 'LOW'];

  top3.forEach((cat, idx) => {
    const priorityLevel = priorities[idx];
    const categoryName = cat.name;
    const score = cat.score;
    const key = cat.key;

    let reason = '';
    let priorityArea = '';
    let whyMatters = '';
    let expectedOutcome = '';
    let actionItem = '';

    const industryLower = ind.toLowerCase() === 'other' ? 'service' : ind.toLowerCase();

    if (key === 'clarity') {
      if (score < 16) {
        const c1 = answers['clarity_1'] || 2;
        const c2 = answers['clarity_2'] || 2;
        const c3 = answers['clarity_3'] || 2;
        
        let gapDetail = 'your online profiles focus heavily on technical skills rather than outcomes.';
        if (c1 <= 6) {
          gapDetail = 'visitors cannot instantly decipher your unique specialty within the critical first 5-second window.';
        } else if (c2 <= 6) {
          gapDetail = 'your audience targeting is too broad, positioning you as a generalist and diluting your strategic authority.';
        } else if (c3 <= 6) {
          gapDetail = 'your messaging focuses heavily on tools and deliverables rather than the commercial value your clients seek.';
        }

        reason = `Selected because your score of ${score}/20 indicates a critical positioning gap where ${gapDetail}`;
        
        let industryContext = `Since you operate in the ${industryLower} space, standing out requires a highly specialized angle.`;
        if (ind === 'Design') {
          industryContext = `Since you provide design services, your website is not only a portfolio — it is the ultimate proof of your ability to create digital experiences.`;
        } else if (ind === 'Development') {
          industryContext = `Since you provide development services, your positioning must bridge the gap between technical execution and actual business outcomes.`;
        } else if (ind === 'Marketing') {
          industryContext = `Since you operate in marketing, your messaging must communicate the direct outcomes you create, not only the marketing tools you use.`;
        } else if (ind === 'Agency' || ind === 'Consulting') {
          industryContext = `As an expert consulting or agency partner, your positioning should communicate high-level business transformation, not merely execution hours.`;
        }

        priorityArea = `Your biggest opportunity is defining and communicating a highly specific, outcome-driven positioning. By refining how ${userInfo.name}'s unique specialty is framed, we can transition your presence from a standard service provider to an essential strategic partner. ${industryContext}`;
        
        whyMatters = `Potential clients usually make decisions based on perceived confidence and clarity. Without strong positioning, they may compare you based only on price or technical skill, treating your expertise as a commodity.`;
        
        expectedOutcome = `Improving this area will make your expertise easier to understand, double client engagement, and significantly increase the likelihood of visitors becoming high-value inquiries.`;

        if (c1 <= 6) {
          actionItem = `Rewrite your primary hero headline using the Outcome Formula: [Target Client Vertical] + [Core Operational Bottleneck Solved] + [Business Value/Transformation]. Remove all generic skill lists from your banner.`;
        } else if (c2 <= 6) {
          actionItem = `Select 1-2 primary client verticals instead of offering services to everyone. Tailor your core copy to address their specific industry-wide bottlenecks and standards.`;
        } else {
          actionItem = `Audit your copy to replace technical skill-lists with transformation stories. Rewrite your service descriptions to focus on the business improvements (e.g. revenue, efficiency, speed) you deliver.`;
        }
      } else {
        reason = `Selected to refine your excellent positioning. Your score of ${score}/20 shows strong core clarity, but we can further leverage this to command elite rates.`;
        priorityArea = `Your biggest opportunity is transitioning from simple clarity to elite narrative alignment. For ${userInfo.name}, this means shaping your messaging to appeal directly to larger corporate or enterprise-level budgets rather than local general markets.`;
        whyMatters = `At the highest levels of business, clients buy security and risk-mitigation. Fine-tuning your positioning to speak of global operational transformation rather than tactical execution secures five-figure deals.`;
        expectedOutcome = `This strategic optimization will increase your average project value and attract higher-caliber clients who appreciate and pay for long-term consulting.`;
        actionItem = `Elevate your pricing and service naming from simple deliverables to proprietary framework names. Transition your proposal templates 100% to value-based options instead of flat-fee or hourly metrics.`;
      }
    } else if (key === 'trust') {
      if (score < 16) {
        const t1 = answers['trust_1'] || 2;
        const t2 = answers['trust_2'] || 2;

        let gapDetail = 'your presence lacks structured case studies demonstrating strategic results.';
        if (t1 <= 6) {
          gapDetail = 'your profile lacks metrics or verified results confirming the transformations you promise.';
        } else if (t2 <= 6) {
          gapDetail = 'you are displaying a basic gallery of past work without describing the business impact of each project.';
        }

        reason = `Selected because your score of ${score}/20 indicates a lack of validation. High-ticket clients require proof before trust, and currently ${gapDetail}`;

        let industryContext = `In professional services, trust is your ultimate asset.`;
        if (ind === 'Design' || ind === 'Development') {
          industryContext = `In your sector, a portfolio is not just a collection of assets; it is strategic proof of how your design and engineering decisions solved real-world business challenges.`;
        } else if (ind === 'Marketing' || ind === 'Agency' || ind === 'Consulting') {
          industryContext = `In professional marketing and consulting, prospects need to see that you have navigated similar challenges and achieved positive ROI before committing to high-ticket partnerships.`;
        }

        priorityArea = `Your biggest opportunity is establishing an undisputed 'Trust Stack' on your profiles. We must move past standard image grids and create comprehensive project breakdowns that highlight the commercial results of ${userInfo.name}'s strategic solutions. ${industryContext}`;

        whyMatters = `High-value clients are fundamentally risk-averse. They do not buy promises; they buy proven outcomes. A lack of transparent proof elements makes you a risky hire, forcing you to compete with cheaper, less-experienced providers.`;

        expectedOutcome = `Strengthening this trust baseline will qualify your inbound leads, eliminate early objections regarding your capabilities, and justify premium pricing structures.`;

        if (t1 <= 6) {
          actionItem = `Reach out to 3 past clients and ask for specific feedback focused on their business results. Display these quotes in high-visibility areas directly on your home page, near your main contact points.`;
        } else {
          actionItem = `Format your best project into a deep case study outlining: (1) the initial challenge, (2) your custom strategic intervention, (3) the positive business metric achieved. Place this as your main proof element.`;
        }
      } else {
        reason = `Selected to amplify your robust credibility. Your score of ${score}/20 is strong, but we can transform these proof points into a compounding conversion asset.`;
        priorityArea = `Your biggest opportunity is turning your excellent reviews into high-profile authority assets. For ${userInfo.name}, this means synthesizing your past client results into a published case-study masterclass.`;
        whyMatters = `Social proof is cumulative. Moving from passive reviews to co-marketing campaigns and video testimonials establishes you as the undisputed thought leader in the ${ind} field.`;
        expectedOutcome = `This will compress your sales cycle timeline, allowing you to close high-intent prospects in a single call without proposal friction.`;
        actionItem = `Convert text testimonials into short video reviews or deep narrative articles. Showcase prominent client logo strips in your primary hero background for instant institutional trust.`;
      }
    } else if (key === 'visual') {
      if (score < 16) {
        const v1 = answers['visual_1'] || 2;
        const v2 = answers['visual_2'] || 2;

        let gapDetail = 'design inconsistencies across your profiles dilute your professionalism.';
        if (v1 <= 6) {
          gapDetail = 'your digital footprint does not reflect the premium caliber of execution that you actually deliver, creating a performance mismatch.';
        } else if (v2 <= 6) {
          gapDetail = 'your branding feels fragmented across platforms, making your business look smaller or less organized.';
        }

        reason = `Selected because your score of ${score}/20 indicates a visual performance mismatch. Our review suggests that ${gapDetail}`;

        let industryContext = `First impressions are 94% design-related.`;
        if (ind === 'Design') {
          industryContext = `Since you provide design services, your visual identity is your literal calling card. Any inconsistency in layout, typography, or spacing directly contradicts your core expertise.`;
        } else if (ind === 'Development') {
          industryContext = `A clean, visually balanced layout suggests clean, high-performance code. Modern, precise designs show that you take execution seriously at every layer.`;
        }

        priorityArea = `Your biggest opportunity is establishing a modern, highly polished, and cohesive brand design. By elevating ${userInfo.name}'s visual consistency, we establish instant professional authority and validate your premium positioning. ${industryContext}`;

        whyMatters = `Humans make split-second aesthetic decisions. A dated or inconsistent layout instantly signals a lack of attention to detail, leading visitors to doubt the operational quality of your actual services.`;

        expectedOutcome = `A unified visual presence will instantly command higher perceived value, differentiate you from low-tier competitors, and build instant alignment with premium clients.`;

        if (v1 <= 6) {
          actionItem = `Introduce modern visual layout patterns, such as spacious card grids, ample margins, and a professional neutral color scheme. Ensure all key landing sections are optimized for responsive mobile screens.`;
        } else {
          actionItem = `Standardize on a precise visual system: limit yourself to 1 primary accent color, 1 neutral background, and 2 cohesive font families. Audit and synchronize all social and web assets to match.`;
        }
      } else {
        reason = `Selected to polish your premium brand visual experience. Your score of ${score}/20 is stellar, but minor details can be refined for ultimate aesthetic perfection.`;
        priorityArea = `Your biggest opportunity is creating a bespoke, high-performance visual signature. For ${userInfo.name}, this means utilizing elegant micro-animations and custom grid typography that commands immediate prestige.`;
        whyMatters = `At the premium tier, design consistency across all touchpoints (proposals, documents, and social profiles) is what establishes trust and commands top-of-market pricing.`;
        expectedOutcome = `A visually impeccable presence eliminates any doubt about your standard of execution, validating a highly premium market positioning.`;
        actionItem = `Refine micro-interactions and transitions on your landing page to feel fluid and premium. Standardize all your outgoing client-facing documents and reports using exact brand styling.`;
      }
    } else if (key === 'conversion') {
      if (score < 16) {
        const co1 = answers['conversion_1'] || 2;
        const co2 = answers['conversion_2'] || 2;

        let gapDetail = 'the pathway from casual reader to client inquiry contains too much administrative friction.';
        if (co1 <= 6) {
          gapDetail = 'your profiles do not emphasize a single, clear next step, which causes cognitive overload for high-intent visitors.';
        } else if (co2 <= 6) {
          gapDetail = 'your conversion path depends on static email links or manual forms, placing the scheduling burden entirely on your prospects.';
        }

        reason = `Selected because your score of ${score}/20 suggests high-friction pathways for inquiries where ${gapDetail}`;

        let industryContext = `In professional services, convenience is the ultimate differentiator.`;
        if (ind === 'Design' || ind === 'Development' || ind === 'Marketing' || ind === 'Agency' || ind === 'Consulting') {
          industryContext = `Your intake flow should feel like an organized, premium consultation. An automated booking setup respects the client's time and streamlines your onboarding.`;
        }

        priorityArea = `Your biggest opportunity is simplifying and automating your lead capture funnel. We must build one clear, frictionless onboarding path for prospects to schedule a call with ${userInfo.name}. ${industryContext}`;

        whyMatters = `Friction is the silent killer of digital inquiries. If a busy prospect has to compose a manual email or navigate a complicated contact page, they will leave and hire a competitor with a seamless scheduling system.`;

        expectedOutcome = `A highly optimized intake path will convert casual website visitors into active strategic calls, multiplying your lead pipeline while saving hours of manual scheduling.`;

        if (co1 <= 6) {
          actionItem = `Select one dominant, high-contrast Call to Action (e.g., 'Book a Strategy Session') and place it prominently in both your header and hero sections. Remove all competing, minor links.`;
        } else {
          actionItem = `Embed a scheduling calendar (like Calendly or SavvyCal) on a clean, dedicated booking page. Add 2-3 pre-qualification questions (budget, timeline, goal) to screen out low-value leads automatically.`;
        }
      } else {
        reason = `Selected to maximize your robust intake funnel. Your score of ${score}/20 is high, but we can optimize your current conversions to filter and pre-qualify leads better.`;
        priorityArea = `Your biggest opportunity is introducing advanced client qualification and value-based pricing options directly in your intake. This protects ${userInfo.name}'s calendar from lower-tier requests.`;
        whyMatters = `An optimized funnel is not just about volume, but quality. Filtering out low-budget leads automatically ensures your energy is reserved for highly lucrative engagements.`;
        expectedOutcome = `This will significantly increase your conversion-to-closed-deal ratio while saving hours of manual administrative call screening.`;
        actionItem = `Add a budget and timeline field to your intake calendar, making it required. Set up an automated client onboarding workflow that sends a welcome deck upon booking.`;
      }
    } else if (key === 'growth') {
      if (score < 16) {
        const g1 = answers['growth_1'] || 2;
        const g2 = answers['growth_2'] || 2;

        let gapDetail = 'you lack a proactive pipeline, which makes your business vulnerable to passive reference dry spells.';
        if (g1 <= 6) {
          gapDetail = 'you currently rely almost entirely on unpredictable word-of-mouth, leaving you with zero control over your pipeline.';
        } else if (g2 <= 6) {
          gapDetail = 'you do not have an owned channel (such as an email database) to capture, nurture, and retain professional attention.';
        }

        reason = `Selected because your score of ${score}/20 highlights an unpredictable client pipeline. Passive word-of-mouth creates feast-or-famine cycles where ${gapDetail}`;

        let industryContext = `Sustainable professional growth requires owned distribution channels.`;
        if (ind === 'Design' || ind === 'Development' || ind === 'Marketing' || ind === 'Agency' || ind === 'Consulting') {
          industryContext = `Referrals are a great validation, but high-ticket growth requires proactivity. Having an active system ensures you only work with premium clients of your choosing.`;
        }

        priorityArea = `Your biggest opportunity is establishing an active, repeatable system for client acquisition. By creating a professional lead capture asset and setting a consistent outreach cadence, ${userInfo.name} can build compounding pipeline equity. ${industryContext}`;

        whyMatters = `Without a repeatable outreach or content engine, your growth is completely passive. You are forced to accept whatever projects come your way, regardless of budget or fit, because you lack pipeline control.`;

        expectedOutcome = `Building an owned marketing channel and outreach habit will establish reliable revenue forecasting, allowing you to selectively hire or pitch to only the most lucrative partnerships.`;

        if (g1 <= 6) {
          actionItem = `Define a weekly outbound connection habit: reach out to 5 ideal strategic prospects on LinkedIn with helpful, non-sales advice. Commit to publishing 1 authoritative project breakdown weekly on your main channel.`;
        } else {
          actionItem = `Design an actionable lead magnet (such as a 1-page playbook or audit checklist) relevant to your ideal client. Embed an email opt-in form to capture leads and build your list.`;
        }
      } else {
        reason = `Selected to scale your established growth channels. Your score of ${score}/20 is strong, but we can transition your marketing into an automated, compounding referral engine.`;
        priorityArea = `Your biggest opportunity is automating your lead generation and building a premium newsletter asset. This will allow ${userInfo.name} to cultivate a community of high-value prospects passively.`;
        whyMatters = `Compounding audience growth is how you separate your time from your marketing. An active newsletter or automated funnel keeps your pipeline full even when you are fully booked.`;
        expectedOutcome = `A predictable, passive inbound channel will build massive business resilience, allowing you to scale your team or raise your rates selectively.`;
        actionItem = `Launch a regular weekly insight newsletter sharing exclusive strategic breakdowns. Set up an automated welcome sequence that nurtures subscribers into buyers over time.`;
      }
    }

    const priorityBadge = `${priorityLevel} PRIORITY • ${categoryName}`;
    
    const textBlock = `🎯 PRIORITY AREA:\n${priorityArea}\n\n` +
                      `🔍 WHY THIS WAS SELECTED:\n${reason}\n\n` +
                      `💡 WHY THIS MATTERS:\n${whyMatters}\n\n` +
                      `📈 EXPECTED OUTCOME:\n${expectedOutcome}`;

    recommendations.push({
      category: priorityBadge,
      text: textBlock,
      actionItem: actionItem,
    });
  });

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

  try {
    const docRef = doc(db, 'analytics', 'counters');
    setDoc(docRef, {
      [metric]: increment(1)
    }, { merge: true }).catch((err) => {
      console.warn('Firestore increment failed:', err);
    });
  } catch (err) {
    console.warn('Firestore increment setup failed:', err);
  }
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

  try {
    const leadId = userInfo.email.toLowerCase().trim();
    const docRef = doc(db, 'leads', leadId);
    setDoc(docRef, {
      name: userInfo.name,
      email: userInfo.email,
      industry: userInfo.industry,
      website: userInfo.website || '',
      social: userInfo.social || '',
      score,
      timestamp,
    }, { merge: true }).catch((err) => {
      console.warn('Firestore addLead failed:', err);
    });
  } catch (err) {
    console.warn('Firestore addLead setup failed:', err);
  }

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

export async function getFirebaseAnalytics(): Promise<AnalyticsData> {
  let pageVisits = 0;
  let assessmentStarts = 0;
  let assessmentCompletions = 0;
  let ctaClicks = 0;
  
  try {
    const countersRef = doc(db, 'analytics', 'counters');
    const countersSnap = await getDoc(countersRef);
    if (countersSnap.exists()) {
      const data = countersSnap.data();
      pageVisits = data.pageVisits || 0;
      assessmentStarts = data.assessmentStarts || 0;
      assessmentCompletions = data.assessmentCompletions || 0;
      ctaClicks = data.ctaClicks || 0;
    }
  } catch (err) {
    console.error('Failed to fetch Firestore analytics:', err);
    const local = getAnalytics();
    pageVisits = local.pageVisits;
    assessmentStarts = local.assessmentStarts;
    assessmentCompletions = local.assessmentCompletions;
    ctaClicks = local.ctaClicks;
  }

  let leads: (UserInfo & { timestamp: string; score: number })[] = [];
  try {
    const leadsRef = collection(db, 'leads');
    const querySnapshot = await getDocs(leadsRef);
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      leads.push({
        name: data.name || '',
        email: data.email || '',
        industry: data.industry || '',
        website: data.website || '',
        social: data.social || '',
        score: data.score || 0,
        timestamp: data.timestamp || new Date().toISOString(),
      });
    });
    leads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    console.error('Failed to fetch Firestore leads:', err);
    const local = getAnalytics();
    leads = local.leads;
  }

  return {
    pageVisits,
    assessmentStarts,
    assessmentCompletions,
    ctaClicks,
    leads,
  };
}

export async function clearFirebaseAnalytics(): Promise<void> {
  try {
    const countersRef = doc(db, 'analytics', 'counters');
    await setDoc(countersRef, {
      pageVisits: 0,
      assessmentStarts: 0,
      assessmentCompletions: 0,
      ctaClicks: 0,
    });

    const leadsRef = collection(db, 'leads');
    const querySnapshot = await getDocs(leadsRef);
    const deletePromises = querySnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
  } catch (err) {
    console.error('Failed to clear Firestore analytics:', err);
  }
}
