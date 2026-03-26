import React from 'react';
import { 
  CheckCircle2, FileText, Upload, Sparkles, Mail, Phone, MapPin, 
  Linkedin, Github, Globe, BookOpen, GraduationCap, Building2, 
  Calendar, Briefcase, FolderGit2, Wrench, Languages, Trophy, Award, Star 
} from 'lucide-react';
import { ParsedResume } from '@/services/resumeService';
import { Section } from './Section';

interface ResumeDisplayProps {
  data: ParsedResume;
  fileName: string;
  onReset: () => void;
}

export function ResumeDisplay({ data, fileName, onReset }: ResumeDisplayProps) {
  return (
    <div className="space-y-8">
      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-8 space-y-8">

          {/* Main Hero Card */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 relative overflow-hidden shadow-none ring-1 ring-blue-50">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 ml-1.5">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-3xl shrink-0 uppercase">
                {data.fullName?.[0] ?? '?'}
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h2 className="text-3xl font-black tracking-tight text-slate-900">{data.fullName ?? 'Candidate Name'}</h2>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-y-3 gap-x-5">
                  {data.email && (
                    <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-sm text-slate-600 font-medium hover:text-blue-600">
                      <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100 text-blue-600"><Mail className="w-4 h-4" /></div> {data.email}
                    </a>
                  )}
                  {data.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium whitespace-nowrap">
                      <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100 text-blue-600"><Phone className="w-4 h-4" /></div> {data.phone}
                    </div>
                  )}
                  {data.location && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100 text-blue-600"><MapPin className="w-4 h-4" /></div> {data.location}
                    </div>
                  )}
                </div>

                {/* Socials */}
                <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
                  {data.linkedIn && (
                    <a href={data.linkedIn.startsWith('http') ? data.linkedIn : `https://${data.linkedIn}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 rounded-xl text-xs font-bold transition-none">
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  )}
                  {data.gitHub && (
                    <a href={data.gitHub.startsWith('http') ? data.gitHub : `https://${data.gitHub}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 rounded-xl text-xs font-bold transition-none">
                      <Github className="w-3.5 h-3.5" /> GitHub
                    </a>
                  )}
                  {data.website && (
                    <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 rounded-xl text-xs font-bold transition-none">
                      <Globe className="w-3.5 h-3.5" /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          {data.summary && (
            <Section icon={<BookOpen className="w-4 h-4" />} title="Professional Summary">
              <p className="text-slate-600 leading-relaxed text-[15px] font-medium whitespace-pre-wrap">{data.summary}</p>
            </Section>
          )}

          {/* Education */}
          {data.education?.length > 0 && (
            <Section icon={<GraduationCap className="w-4 h-4" />} title="Education">
              <div className="space-y-8">
                {data.education.map((edu, i) => (
                  <div key={i} className={`relative pl-8 ${i < data.education.length - 1 ? 'pb-8 border-l-2 border-slate-100 ml-1.5' : 'ml-1.5'}`}>
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-none" />
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 text-[16px]">
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </h3>
                        {edu.institution && (
                          <div className="flex items-center gap-2 mt-1.5 text-blue-600 font-bold text-sm">
                            <Building2 className="w-4 h-4" /> {edu.institution}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:items-end gap-1 shrink-0">
                        {(edu.startDate || edu.endDate) && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                          </div>
                        )}
                        {edu.gpa && (
                          <div className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full mt-1">GPA: {edu.gpa}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Experience */}
          {data.experience?.length > 0 && (
            <Section icon={<Briefcase className="w-4 h-4" />} title="Work Experience">
              <div className="space-y-8">
                {data.experience.map((exp, i) => (
                  <div key={i} className={`relative pl-8 ${i < data.experience.length - 1 ? 'pb-8 border-l-2 border-slate-100 ml-1.5' : 'ml-1.5'}`}>
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-none" />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-[16px]">{exp.title}</h3>
                        {exp.company && (
                          <div className="flex items-center gap-2 mt-1 text-blue-600 font-bold text-sm">
                            <Building2 className="w-4 h-4" /> {exp.company}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:items-end gap-1">
                        {(exp.startDate || exp.endDate) && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : exp.isCurrent ? '— Present' : ''}
                          </div>
                        )}
                        {exp.location && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mt-1 sm:justify-end">
                            <MapPin className="w-3.5 h-3.5" /> {exp.location}
                          </div>
                        )}
                      </div>
                    </div>
                    {exp.bullets?.length > 0 && (
                      <ul className="mt-4 space-y-2.5">
                        {exp.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-3 text-[14px] text-slate-600 font-medium whitespace-pre-wrap">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Projects */}
          {data.projects?.length > 0 && (
            <Section icon={<FolderGit2 className="w-4 h-4" />} title="Projects">
              <div className="space-y-10">
                {data.projects.map((proj, i) => (
                  <div key={i} className={`relative pl-8 ${i < data.projects.length - 1 ? 'pb-10 border-l-2 border-slate-100 ml-1.5' : 'ml-1.5'}`}>
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-none" />

                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-bold text-slate-900 text-[18px] tracking-tight">{proj.name}</h3>
                    </div>
                    {proj.description && (
                      <p className="mt-3 text-[15px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                        {proj.description}
                      </p>
                    )}
                    {proj.link && (
                      <div className="mt-4">
                        <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-[13px] font-bold transition-none">
                          View Project <Globe className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar (Skills, Languages, etc.) */}
        <div className="lg:col-span-4 space-y-8">

          {/* Skills Section */}
          {(data.technicalSkills?.length > 0 || data.softSkills?.length > 0) && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 text-blue-600"><Wrench className="w-5 h-5" /></div>
                <h2 className="text-lg font-black text-slate-900">Skills & Expertise</h2>
              </div>

              <div className="space-y-8">
                {data.technicalSkills?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <div className="w-1 h-3 bg-blue-500 rounded-full"></div> Technical Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.technicalSkills.map((s) => (
                        <span key={s} className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl shadow-none hover:bg-white hover:border-blue-400 cursor-default">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.softSkills?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <div className="w-1 h-3 bg-emerald-500 rounded-full"></div> Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.softSkills.map((s) => (
                        <span key={s} className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl shadow-none hover:bg-white hover:border-emerald-400 cursor-default">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages?.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-none">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600"><Languages className="w-5 h-5" /></div>
                <h2 className="text-base font-black text-slate-900">Languages</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((l) => (
                  <span key={l} className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl shadow-none">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Awards */}
          {(data.certifications?.length > 0 || data.awards?.length > 0) && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 text-blue-600"><Trophy className="w-5 h-5" /></div>
                <h2 className="text-base font-black text-slate-900">Achievements</h2>
              </div>

              <div className="space-y-6">
                {data.certifications?.length > 0 && (
                  <ul className="space-y-3">
                    {data.certifications.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-none group shadow-none">
                        <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-blue-500 group-hover:scale-110 transition-none"><Award className="w-4 h-4" /></div>
                        <span className="text-xs font-bold text-slate-700 mt-1">{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {data.awards?.length > 0 && (
                  <ul className="space-y-3">
                    {data.awards.map((a, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-none group shadow-none">
                        <div className="p-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-500 group-hover:scale-110 transition-none"><Star className="w-4 h-4" /></div>
                        <span className="text-xs font-bold text-slate-700 mt-1">{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
