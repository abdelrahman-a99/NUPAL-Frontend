import { careerServicesApiUrl } from '../config/careerApi';
import { getToken } from '../lib/auth';

const RESUME_API = () => careerServicesApiUrl('/v1/resume');

/** FastAPI HTTPException uses `{ detail: string | object }`; surface it in UI errors. */
function fastApiDetailMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: string };
    if (typeof first?.msg === 'string') return first.msg;
  }
  return null;
}

export interface ParsedResumeExperience {
  title: string | null;
  company: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean | null;
  bullets: string[];
}

export interface ParsedResumeEducation {
  degree: string | null;
  field: string | null;
  institution: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  gpa: string | null;
}

export interface ParsedResumeProject {
  name: string | null;
  description: string | null;
  technologies: string[];
  link: string | null;
}

export interface ParsedResume {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedIn: string | null;
  gitHub: string | null;
  website: string | null;
  summary: string | null;
  technicalSkills: string[];
  softSkills: string[];
  experience: ParsedResumeExperience[];
  education: ParsedResumeEducation[];
  projects: ParsedResumeProject[];
  certifications: string[];
  languages: string[];
  awards: string[];
}

export interface ResumeHistoryItem {
  id: string;
  fileName: string;
  analyzedAt: string;
  fullName?: string;
}

export interface JobFitHistoryItem {
  id: string;
  jobTitle?: string;
  companyName?: string;
  overallScore: number;
  matchStatus?: string;
  jobUrl: string;
  analyzedAt: string;
}

export async function parseResume(file: File): Promise<{ id: string; data: ParsedResume }> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${RESUME_API()}/parse`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).error || `Server error ${response.status}`);
  }

  return response.json();
}

export async function getResumeHistory(): Promise<ResumeHistoryItem[]> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${RESUME_API()}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error(`getResumeHistory failed (${response.status}):`, err);
    throw new Error(err.message || err.detail || 'Failed to fetch history');
  }
  return response.json();
}

export async function getResumeById(id: string): Promise<ParsedResume> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${RESUME_API()}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error(`getResumeById failed (${response.status}):`, err);
    throw new Error(err.message || err.detail || 'Failed to fetch analysis');
  }
  return response.json();
}

export async function deleteResume(id: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${RESUME_API()}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Failed to delete');
}

export async function analyzeJobFit(jobUrl?: string, jobDescription?: string, resumeId?: string): Promise<{
  id: string;
  analysis: any;
  jobDescriptionText?: string | null;
}> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${RESUME_API()}/job-fit/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ jobUrl, jobDescription, resumeId }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg =
      fastApiDetailMessage(err) ||
      (err as { message?: string }).message ||
      (err as { error?: string }).error ||
      'Failed to analyze job fit';
    throw new Error(msg);
  }

  return response.json();
}

export async function getJobFitHistory(): Promise<JobFitHistoryItem[]> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${RESUME_API()}/job-fit/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error(`getJobFitHistory failed (${response.status}):`, err);
    throw new Error(err.message || err.detail || 'Failed to fetch job fit history');
  }
  return response.json();
}

export async function getJobFitById(id: string): Promise<{
  id: string;
  analysis: any;
  jobUrl: string;
  analyzedAt: string;
  jobDescriptionText?: string | null;
}> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${RESUME_API()}/job-fit/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error(`getJobFitById failed (${response.status}):`, err);
    throw new Error(err.message || err.detail || 'Failed to fetch job fit result');
  }
  return response.json();
}

export async function deleteJobFit(id: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${RESUME_API()}/job-fit/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Failed to delete job fit result');
}
