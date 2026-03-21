import { getToken } from '../lib/auth';
import { API_ENDPOINTS } from '../config/api';

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

export async function parseResume(file: File): Promise<ParsedResume> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_ENDPOINTS.RESUME}/parse`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type here — browser sets it automatically with boundary for multipart
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).error || `Server error ${response.status}`);
  }

  return response.json();
}
