import { Question } from './types';

export const AUDIT_QUESTIONS: Question[] = [
  // SECTION 1: BRAND CLARITY (Max Clarity Score calculated based on answers, scaled to 20)
  {
    id: 'clarity_1',
    label: 'STEP 01',
    text: 'Can someone understand what you do within 5 seconds of seeing your profile?',
    category: 'clarity',
    options: [
      { text: 'Yes, my service and unique value are immediately clear', score: 10 },
      { text: 'They understand my skill set, but not my difference or specialty', score: 6 },
      { text: 'No, I usually have to explain what I do in detail', score: 2 }
    ]
  },
  {
    id: 'clarity_2',
    label: 'STEP 02',
    text: 'Is your ideal client clearly defined?',
    category: 'clarity',
    options: [
      { text: 'Yes, I know exactly who I serve and design my content for them', score: 10 },
      { text: 'I have a general audience or industry niche in mind', score: 6 },
      { text: 'No, I serve anyone who needs my skill set', score: 2 }
    ]
  },
  {
    id: 'clarity_3',
    label: 'STEP 03',
    text: 'Does your online messaging focus more on outcomes than just services?',
    category: 'clarity',
    options: [
      { text: 'Yes, I lead with business outcomes and client transformations', score: 10 },
      { text: 'Sometimes, but I often fall back on listing my tools or deliverables', score: 6 },
      { text: 'No, my messaging is mostly a list of features, skills, and services', score: 2 }
    ]
  },

  // SECTION 2: TRUST & CREDIBILITY (Max Trust Score scaled to 20)
  {
    id: 'trust_1',
    label: 'STEP 04',
    text: 'When someone discovers you online, why should they trust you?',
    category: 'trust',
    options: [
      { text: 'I have verified client results, testimonials, and case studies visible', score: 10 },
      { text: 'I show my experience and portfolio, but lack detailed client results', score: 6 },
      { text: 'I am still building my credibility and portfolio', score: 2 }
    ]
  },
  {
    id: 'trust_2',
    label: 'STEP 05',
    text: 'Which credibility elements do you currently display prominently?',
    category: 'trust',
    options: [
      { text: 'Complete portfolio with detailed project breakdowns + testimonials', score: 10 },
      { text: 'A basic gallery of work or list of clients without case studies', score: 6 },
      { text: 'No structured portfolio or public proof of work yet', score: 2 }
    ]
  },

  // SECTION 3: VISUAL EXPERIENCE (Max Visual Score scaled to 20)
  {
    id: 'visual_1',
    label: 'STEP 06',
    text: 'Does your online presence represent the quality of your actual work?',
    category: 'visual',
    options: [
      { text: 'Yes, it is highly polished, consistent, and looks incredibly premium', score: 10 },
      { text: 'It is decent, but does not fully reflect the caliber of work I deliver', score: 6 },
      { text: 'No, it looks outdated, disorganized, or needs serious visual refinement', score: 2 }
    ]
  },
  {
    id: 'visual_2',
    label: 'STEP 07',
    text: 'How consistent is your branding (fonts, colors, logos) across your platforms?',
    category: 'visual',
    options: [
      { text: 'Perfect. Everything looks cohesive and intentionally branded', score: 10 },
      { text: 'Somewhat consistent, but there are mismatched elements', score: 6 },
      { text: 'Very inconsistent. Each profile feels like a different brand', score: 2 }
    ]
  },

  // SECTION 4: CONVERSION SYSTEM (Max Conversion Score scaled to 20)
  {
    id: 'conversion_1',
    label: 'STEP 08',
    text: 'Is it obvious what someone should do next after finding you?',
    category: 'conversion',
    options: [
      { text: 'Yes, I have one dominant, clear Call to Action (CTA) on my page', score: 10 },
      { text: 'There is a contact link, but it is not emphasized or prominent', score: 6 },
      { text: 'No, they have to dig around to find out how to hire me', score: 2 }
    ]
  },
  {
    id: 'conversion_2',
    label: 'STEP 09',
    text: 'What conversion channels do you have actively set up?',
    category: 'conversion',
    options: [
      { text: 'Interactive booking calendar (e.g. Calendly) or streamlined intake form', score: 10 },
      { text: 'A basic email link or static contact form with no automation', score: 6 },
      { text: 'No direct way for clients to start a project or book a call', score: 2 }
    ]
  },

  // SECTION 5: GROWTH FOUNDATION (Max Growth Score scaled to 20)
  {
    id: 'growth_1',
    label: 'STEP 10',
    text: 'Do you have a repeatable client acquisition system?',
    category: 'growth',
    options: [
      { text: 'Yes, I actively publish authority content or run reliable outbound campaigns', score: 10 },
      { text: 'No, I rely almost entirely on word-of-mouth or unpredictable referrals', score: 6 },
      { text: 'No, I am completely reactive and struggle to find new clients regularly', score: 2 }
    ]
  },
  {
    id: 'growth_2',
    label: 'STEP 11',
    text: 'Do you build a long-term audience or collect email subscribers?',
    category: 'growth',
    options: [
      { text: 'Yes, I actively collect emails or grow a dedicated professional audience', score: 10 },
      { text: 'I am planning to, but do not have a system set up yet', score: 6 },
      { text: 'No, I do not collect emails or build an audience', score: 2 }
    ]
  }
];

export const INDUSTRIES = [
  'Design',
  'Development',
  'Marketing',
  'Agency',
  'Consulting',
  'Creator',
  'Ecommerce',
  'Other'
];
