import { ParsedResume } from '@/services/resumeService';

export interface JobFitAnalysisData {
  overallScore: number;
  matchStatus: string;
  detailedSummary: string;
  highlights: string[];
  opportunities: string[];
  recommendations: string[];
  breakdown: {
    skills: number;
    experience: number;
    domain: number;
    credentials: number;
    readiness: number;
    skillsNote?: string;
    experienceNote?: string;
    domainNote?: string;
    credentialsNote?: string;
    matchedSkills: {
      skill: string;
      evidence: string;
      level: string;
    }[];
    missingSkills: {
      skill: string;
      importance: string;
      fixable: string;
    }[];
  };
  actionPlan: {
    title: string;
    description: string;
    targetGap?: string;
    expectedImpact: string;
    priority: string;
    status: string;
  }[];
  interviewFocus: string[];
  suggestedLearning: string[];
  redFlags?: string[];
  jobTitle?: string;
  companyName?: string;
}
