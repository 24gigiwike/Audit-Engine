export interface UserInfo {
  name: string;
  email: string;
  industry: string;
  website?: string;
  social?: string;
}

export interface AnswerOption {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  label: string; // e.g. "STEP 01"
  text: string;
  category: 'clarity' | 'trust' | 'visual' | 'conversion' | 'growth';
  options: AnswerOption[];
}

export interface CategoryResult {
  name: string;
  score: number;
  maxScore: number;
  rating: string;
  description: string;
}

export interface AuditResult {
  overallScore: number;
  categoryResults: Record<string, CategoryResult>;
  tier: 'Digital Authority' | 'Strong Foundation' | 'Hidden Potential' | 'Needs Strategic Refinement';
  strengths: string[];
  weaknesses: string[];
  recommendations: {
    category: string;
    text: string;
    actionItem: string;
  }[];
}

export interface AnalyticsData {
  pageVisits: number;
  assessmentStarts: number;
  assessmentCompletions: number;
  ctaClicks: number;
  leads: (UserInfo & { timestamp: string; score: number })[];
}
