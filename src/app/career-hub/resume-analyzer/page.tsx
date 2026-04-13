'use client';

import { Suspense, useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getToken } from '@/lib/auth';
import {
  parseResume, getResumeHistory, getResumeById, deleteResume,
  analyzeJobFit, getJobFitHistory, getJobFitById, deleteJobFit,
  type ParsedResume, type ResumeHistoryItem, type JobFitHistoryItem
} from '@/services/resumeService';
import { AlertCircle, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { JobFitReport } from '@/components/career-hub/resume-analyzer/JobFitReport';
import { JobFitHistoryList } from '@/components/career-hub/resume-analyzer/JobFitHistoryList';
import { ResumeDisplay } from '@/components/career-hub/resume-analyzer/ResumeDisplay';
import { SidebarNav, NavTabId } from '@/components/career-hub/resume-analyzer/SidebarNav';
import { CVScoringTab } from '@/components/career-hub/resume-analyzer/CVScoringTab';
import { JobFitTab } from '@/components/career-hub/resume-analyzer/JobFitTab';
import { ProgressOverlay } from '@/components/career-hub/resume-analyzer/ProgressOverlay';
import { JobSelector } from '@/components/career-hub/resume-analyzer/JobSelector';
import { InterviewPracticeSession } from '@/components/interview/InterviewPracticeSession';

// Types
import { JobFitAnalysisData } from './types';
const CAREER_HUB_BASE_PATH = '/career-hub';

function buildFallbackJobDescription(data: JobFitAnalysisData): string {
  const lines = [
    data.detailedSummary,
    ...(data.interviewFocus ?? []).map((x) => `Interview focus: ${x}`),
  ].filter(Boolean);
  return (
    lines.join('\n\n') ||
    'Re-run Job Match with the job link or pasted description for a fully tailored interview.'
  );
}

type JobFitState = JobFitAnalysisData & {
  id?: string;
  jobDescriptionText?: string | null;
  jobUrl?: string;
};

function ResumeAnalyzerPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!getToken()) router.push('/login');
  }, [router]);

  useEffect(() => {
    if (pathname === '/career-hub/resume-analyzer') {
      const query = searchParams.toString();
      router.replace(query ? `${CAREER_HUB_BASE_PATH}?${query}` : CAREER_HUB_BASE_PATH, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  // Force scroll to top natively on hard refresh
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // UI State
  const initialTab = (searchParams.get('tab') as NavTabId) || 'resume-checking';
  const [activeTab, setActiveTab] = useState<NavTabId>(initialTab);
  const [error, setError] = useState<string | null>(null);

  // CV State
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [fileName, setFileName] = useState('');
  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isResumeDetailsLoading, setIsResumeDetailsLoading] = useState(false);
  const [loadedResumeId, setLoadedResumeId] = useState<string | null>(null);

  // Overlay State System
  const [overlay, setOverlay] = useState<{ isOpen: boolean; type: 'cv' | 'jobfit'; isReady: boolean }>({
    isOpen: false,
    type: 'cv',
    isReady: false
  });
  const [pendingParsed, setPendingParsed] = useState<ParsedResume | null>(null);
  const [pendingJobFit, setPendingJobFit] = useState<JobFitState | null>(null);

  // Job Fit State
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobFitActiveTab, setJobFitActiveTab] = useState<'url' | 'text'>('url');
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [jobFitData, setJobFitData] = useState<JobFitState | null>(null);
  const [jobFitHistory, setJobFitHistory] = useState<JobFitHistoryItem[]>([]);
  const [isJobFitDetailsLoading, setIsJobFitDetailsLoading] = useState(false);
  const [isSilentJobFitLoad, setIsSilentJobFitLoad] = useState(false);
  const [loadedJobFitId, setLoadedJobFitId] = useState<string | null>(null);

  const loadResumeDetailsById = useCallback(
    async (id: string, fileNameHint?: string, shouldScroll = true) => {
      if (isResumeDetailsLoading) return;
      if (loadedResumeId === id && parsed) return;

      if (shouldScroll) window.scrollTo(0, 0);
      setIsResumeDetailsLoading(true);
      setError(null);
      if (fileNameHint) setFileName(fileNameHint);
      else {
        const fromHistory = history.find((h) => h.id === id);
        if (fromHistory) setFileName(fromHistory.fileName);
      }

      try {
        const data = await getResumeById(id);
        setParsed(data);
        setLoadedResumeId(id);
        setSelectedResumeId(id);
      } catch (err: any) {
        setError('Failed to load analysis from history.');
      } finally {
        setIsResumeDetailsLoading(false);
      }
    },
    [history, isResumeDetailsLoading, loadedResumeId, parsed]
  );

  const loadJobFitDetailsById = useCallback(
    async (id: string, shouldScroll = true) => {
      if (isJobFitDetailsLoading) return;
      if (loadedJobFitId === id && jobFitData) return;

      if (shouldScroll) window.scrollTo(0, 0);
      setIsJobFitDetailsLoading(true);
      setIsSilentJobFitLoad(!shouldScroll);
      setError(null);
      try {
        const result = await getJobFitById(id);
        setJobFitData({
          ...result.analysis,
          id: result.id,
          jobDescriptionText: result.jobDescriptionText ?? null,
          jobUrl: result.jobUrl,
        });
        setLoadedJobFitId(id);
      } catch (err: any) {
        setError('Failed to load job fit analysis from history.');
      } finally {
        setIsJobFitDetailsLoading(false);
        setIsSilentJobFitLoad(false);
      }
    },
    [isJobFitDetailsLoading, loadedJobFitId, jobFitData]
  );

  const loadHistory = useCallback(async () => {
    try {
      const [resHistory, jfHistory] = await Promise.all([
        getResumeHistory(),
        getJobFitHistory().catch(() => [])
      ]);
      setHistory(resHistory);
      setJobFitHistory(jfHistory);

      if (resHistory.length > 0 && !selectedResumeId) {
        setSelectedResumeId(resHistory[0].id);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [selectedResumeId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Sync activeTab with URL 'tab' param when not forced by IDs
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as NavTabId;
    const resumeId = searchParams.get('resumeId');
    const jobFitId = searchParams.get('jobFitId');
    
    if (tabFromUrl && !resumeId && !jobFitId) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const resumeId = searchParams.get('resumeId');
    if (resumeId) {
      setActiveTab('resume-checking');
      void loadResumeDetailsById(resumeId);
    } else {
      setParsed(null);
      setLoadedResumeId(null);
    }
  }, [searchParams, loadResumeDetailsById]);

  useEffect(() => {
    const jobFitId = searchParams.get('jobFitId');
    const tabFromUrl = searchParams.get('tab');

    if (jobFitId) {
      if (tabFromUrl !== 'interview-prep') {
        setActiveTab('job-fit');
      }
      void loadJobFitDetailsById(jobFitId);
    } else {
      if (activeTab !== 'interview-prep') {
        setJobFitData(null);
        setLoadedJobFitId(null);
      }
    }
  }, [searchParams, activeTab, loadJobFitDetailsById]);

  useEffect(() => {
    if (activeTab === 'interview-prep' && !jobFitData && !isJobFitDetailsLoading && jobFitHistory.length > 0) {
      void loadJobFitDetailsById(jobFitHistory[0].id, false);
    }
  }, [activeTab, jobFitData, isJobFitDetailsLoading, jobFitHistory, loadJobFitDetailsById]);

  const updateAnalyzerUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      const query = params.toString();
      router.push(
        query ? `${CAREER_HUB_BASE_PATH}?${query}` : CAREER_HUB_BASE_PATH
      );
    },
    [router, searchParams]
  );

  const selectTab = useCallback(
    (tab: NavTabId) => {
      setError(null);
      setActiveTab(tab);
      updateAnalyzerUrl({
        tab,
        resumeId: null,
        jobFitId: null
      });
    },
    [updateAnalyzerUrl]
  );

  const isViewingSpecificResume = activeTab === 'resume-checking' && (!!searchParams.get('resumeId') || isResumeDetailsLoading);
  const isViewingSpecificJobFit = activeTab === 'job-fit' && (!!searchParams.get('jobFitId') || (isJobFitDetailsLoading && !isSilentJobFitLoad));
  const hideChrome = isViewingSpecificResume || isViewingSpecificJobFit;

  const handleFile = async (file: File) => {
    setOverlay({ isOpen: true, type: 'cv', isReady: false });
    setError(null);
    setParsed(null);
    setPendingParsed(null);
    setFileName(file.name);

    try {
      const result = await parseResume(file);
      setPendingParsed(result.data);
      setOverlay(prev => ({ ...prev, isReady: true }));
      loadHistory();
    } catch (err: any) {
      setError(err.message ?? 'Failed to parse resume. Please try again.');
      setOverlay(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleLoadFromHistory = async (item: ResumeHistoryItem) => {
    setActiveTab('resume-checking');
    updateAnalyzerUrl({ tab: 'resume-checking', resumeId: item.id, jobFitId: null });
    await loadResumeDetailsById(item.id, item.fileName);
  };

  const handleResetCV = () => {
    window.scrollTo(0, 0);
    setError(null);
    updateAnalyzerUrl({ tab: 'resume-checking', resumeId: null });
  };

  const handleDeleteHistory = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis summary?')) return;
    try {
      await deleteResume(id);
      setHistory(prev => prev.filter(h => h.id !== id));
      if (selectedResumeId === id) {
        setSelectedResumeId(null);
      }
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  const handleJobFit = async () => {
    const isUrlMode = jobFitActiveTab === 'url';
    if (isUrlMode && !jobUrl) {
      setError('Please enter a job URL.');
      return;
    }
    if (!isUrlMode && !jobDescription) {
      setError('Please enter a job description.');
      return;
    }
    if (!selectedResumeId) {
      setError('Please select a resume for comparison.');
      return;
    }

    setOverlay({ isOpen: true, type: 'jobfit', isReady: false });
    setError(null);
    setPendingJobFit(null);

    try {
      const data = await analyzeJobFit(
        isUrlMode ? jobUrl : undefined,
        isUrlMode ? undefined : jobDescription,
        selectedResumeId
      );
      setPendingJobFit({
        ...data.analysis,
        id: data.id,
        jobDescriptionText: data.jobDescriptionText ?? null,
        jobUrl: isUrlMode ? jobUrl.trim() : 'Manual Entry',
      });
      setOverlay(prev => ({ ...prev, isReady: true }));
      loadHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to analyze job fit. You may need to upload a resume first.');
      setOverlay(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleOverlayComplete = () => {
    window.scrollTo(0, 0);
    if (overlay.type === 'cv' && pendingParsed) {
      setParsed(pendingParsed);
    } else if (overlay.type === 'jobfit' && pendingJobFit) {
      setJobFitData(pendingJobFit);
    }
    setOverlay(prev => ({ ...prev, isOpen: false, isReady: false }));
  };

  const handleLoadJobFitFromHistory = async (item: JobFitHistoryItem) => {
    setActiveTab('job-fit');
    updateAnalyzerUrl({ tab: 'job-fit', jobFitId: item.id, resumeId: null });
    await loadJobFitDetailsById(item.id);
  };

  const handleDeleteJobFit = async (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this job fit result?')) return;
    try {
      await deleteJobFit(id);
      setJobFitHistory(prev => prev.filter(h => h.id !== id));
      if (jobFitData?.id === id) {
        setJobFitData(null);
        setLoadedJobFitId(null);
        updateAnalyzerUrl({ jobFitId: null });
      }
    } catch (err) {
      alert('Failed to delete job fit result.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      {!hideChrome && (
        <div className="max-w-7xl mx-auto mb-12 text-center">
          {activeTab !== 'interview-prep' && (
            <motion.div
              initial={{ y: -5 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'resume-checking' && 'Resume Checking'}
                {activeTab === 'job-fit' && 'Job Match Analysis'}
              </h1>
              <p className="mt-2 text-slate-500 font-semibold text-sm sm:text-base">
                {activeTab === 'resume-checking' && 'Get deep AI-powered insights on your CV structure'}
                {activeTab === 'job-fit' && 'Measure your fit against any job description'}
              </p>
            </motion.div>
          )}
        </div>
      )}

      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative pb-10">
        {!hideChrome && (
          <div className="lg:sticky lg:top-24 shrink-0 w-full lg:w-auto self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto pr-2 custom-scrollbar">
            <SidebarNav
              activeTab={activeTab}
              onSelect={selectTab}
              interviewLocked={!jobFitData}
            />
          </div>
        )}

        <div className="flex-1 w-full flex flex-col items-center">
          {error && (
            <div className="mb-8 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 w-full max-w-4xl animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Action failed</p>
                <p className="mt-0.5 font-medium text-red-600/90">{error}</p>
              </div>
            </div>
          )}

          {activeTab === 'resume-checking' && (
            <motion.div
              key="resume-checking"
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full flex flex-col items-center gap-8"
            >
              {!searchParams.get('resumeId') && !isResumeDetailsLoading && (
                <CVScoringTab
                  history={history}
                  isHistoryLoading={isHistoryLoading}
                  onUpload={handleFile}
                  onSelectExisting={handleLoadFromHistory}
                  isUploading={overlay.isOpen}
                  onDeleteHistory={handleDeleteHistory}
                />
              )}

              {isResumeDetailsLoading ? (
                <DetailsSkeleton kind="resume" />
              ) : (
                parsed && searchParams.get('resumeId') && (
                  <ResumeDisplay
                    data={parsed}
                    fileName={fileName}
                    onReset={handleResetCV}
                  />
                )
              )}
            </motion.div>
          )}

          {activeTab === 'job-fit' && (
            <motion.div
              key="job-fit"
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full flex flex-col items-center gap-8"
            >
              {!searchParams.get('jobFitId') && (!isJobFitDetailsLoading || isSilentJobFitLoad) && (
                <JobFitTab
                  jobUrl={jobUrl}
                  setJobUrl={setJobUrl}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                  activeTab={jobFitActiveTab}
                  setActiveTab={setJobFitActiveTab}
                  history={history}
                  selectedResumeId={selectedResumeId}
                  setSelectedResumeId={setSelectedResumeId}
                  onAnalyze={handleJobFit}
                  isAnalyzing={overlay.isOpen}
                  canAnalyze={(jobFitActiveTab === 'url' ? !!jobUrl : !!jobDescription) && !!selectedResumeId}
                />
              )}

              {(isJobFitDetailsLoading && !isSilentJobFitLoad) ? (
                <DetailsSkeleton kind="jobfit" />
              ) : (
                jobFitData && searchParams.get('jobFitId') && (
                  <JobFitReport
                    data={jobFitData}
                    onBack={() => {
                      window.scrollTo(0, 0);
                      updateAnalyzerUrl({ tab: 'job-fit', jobFitId: null });
                    }}
                    onDelete={(id) => handleDeleteJobFit(null, id)}
                    onStartInterviewPrep={() => {
                      setActiveTab('interview-prep');
                      updateAnalyzerUrl({ tab: 'interview-prep', jobFitId: loadedJobFitId });
                    }}
                  />
                )
              )}

              {(!isJobFitDetailsLoading || isSilentJobFitLoad) && (isHistoryLoading || jobFitHistory.length > 0) && !searchParams.get('jobFitId') && (
                <div className="w-full mt-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 ml-1">Recent Job Fit Analyses</h3>
                  <JobFitHistoryList
                    history={jobFitHistory}
                    isLoading={isHistoryLoading}
                    onLoad={handleLoadJobFitFromHistory}
                    onDelete={handleDeleteJobFit}
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'interview-prep' && (
            <motion.div
              key="interview-prep"
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full flex flex-col items-center"
            >
              <div className="w-full max-w-7xl">
                <InterviewPracticeSession
                  compact
                  jobFitHistory={jobFitHistory}
                  isLoadingHistory={isHistoryLoading || isJobFitDetailsLoading}
                  onJobSelect={async (item) => {
                    await loadJobFitDetailsById(item.id, false);
                    updateAnalyzerUrl({ tab: 'interview-prep' });
                  }}
                  jobContext={jobFitData ? {
                    id: jobFitData.id,
                    jobTitle: jobFitData.jobTitle || 'Target role',
                    companyName: jobFitData.companyName,
                    jobDescription:
                      (jobFitData.jobDescriptionText &&
                        jobFitData.jobDescriptionText.trim()) ||
                      buildFallbackJobDescription(jobFitData),
                    jobUrl: jobFitData.jobUrl,
                  } as any : null}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <ProgressOverlay
        isOpen={overlay.isOpen}
        type={overlay.type}
        isDataReady={overlay.isReady}
        onComplete={handleOverlayComplete}
      />
    </div>
  );
}

function DetailsSkeleton({ kind }: { kind: 'resume' | 'jobfit' }) {
  if (kind === 'jobfit') {
    return (
      <div className="w-full max-w-7xl space-y-6 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <div className="space-y-3">
            <div className="h-6 w-28 rounded-full bg-slate-200" />
            <div className="h-10 w-80 rounded-xl bg-slate-200" />
            <div className="h-4 w-52 rounded-lg bg-slate-100" />
          </div>
          <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-3">
              <div className="h-5 w-44 rounded-lg bg-slate-200" />
              <div className="h-4 w-full rounded-md bg-slate-100" />
              <div className="h-4 w-11/12 rounded-md bg-slate-100" />
              <div className="h-4 w-9/12 rounded-md bg-slate-100" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="h-5 w-40 rounded-lg bg-slate-200 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="h-28 rounded-2xl bg-slate-100" />
                <div className="h-28 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-slate-100" />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4">
              <div className="h-5 w-52 rounded-lg bg-slate-200" />
              <div className="h-20 rounded-2xl bg-slate-100" />
              <div className="h-20 rounded-2xl bg-slate-100" />
              <div className="h-20 rounded-2xl bg-slate-100" />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="h-10 rounded-xl bg-slate-100" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-11 rounded-xl bg-slate-100" />
              <div className="h-11 rounded-xl bg-slate-100" />
              <div className="h-11 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl space-y-6 animate-pulse">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-200 shrink-0" />
          <div className="w-full space-y-3">
            <div className="h-8 w-72 rounded-lg bg-slate-200" />
            <div className="h-4 w-64 rounded-md bg-slate-100" />
            <div className="h-4 w-56 rounded-md bg-slate-100" />
            <div className="flex gap-2 pt-2">
              <div className="h-7 w-20 rounded-xl bg-slate-100" />
              <div className="h-7 w-20 rounded-xl bg-slate-100" />
              <div className="h-7 w-20 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-3">
            <div className="h-5 w-44 rounded-lg bg-slate-200" />
            <div className="h-4 w-full rounded-md bg-slate-100" />
            <div className="h-4 w-11/12 rounded-md bg-slate-100" />
            <div className="h-4 w-8/12 rounded-md bg-slate-100" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4">
            <div className="h-5 w-36 rounded-lg bg-slate-200" />
            <div className="h-20 rounded-2xl bg-slate-100" />
            <div className="h-20 rounded-2xl bg-slate-100" />
            <div className="h-20 rounded-2xl bg-slate-100" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <div className="h-5 w-32 rounded-lg bg-slate-200" />
            <div className="h-9 rounded-xl bg-slate-100" />
            <div className="h-9 rounded-xl bg-slate-100" />
            <div className="h-9 rounded-xl bg-slate-100" />
            <div className="h-9 rounded-xl bg-slate-100" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <div className="h-5 w-28 rounded-lg bg-slate-200" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeAnalyzerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50/50">
          <p className="text-slate-500">Loading Career Hub…</p>
        </div>
      }
    >
      <ResumeAnalyzerPageInner />
    </Suspense>
  );
}
