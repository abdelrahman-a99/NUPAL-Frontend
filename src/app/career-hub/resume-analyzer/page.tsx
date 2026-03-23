'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import {
  parseResume, getResumeHistory, getResumeById, deleteResume,
  analyzeJobFit, getJobFitHistory, getJobFitById, deleteJobFit,
  type ParsedResume, type ResumeHistoryItem, type JobFitHistoryItem
} from '@/services/resumeService';
import { AlertCircle } from 'lucide-react';

// Components
import { JobFitReport } from '@/components/career-hub/resume-analyzer/JobFitReport';
import { JobFitHistoryList } from '@/components/career-hub/resume-analyzer/JobFitHistoryList';
import { ResumeDisplay } from '@/components/career-hub/resume-analyzer/ResumeDisplay';
import { SidebarNav, NavTabId } from '@/components/career-hub/resume-analyzer/SidebarNav';
import { CVScoringTab } from '@/components/career-hub/resume-analyzer/CVScoringTab';
import { JobFitTab } from '@/components/career-hub/resume-analyzer/JobFitTab';
import { ProgressOverlay } from '@/components/career-hub/resume-analyzer/ProgressOverlay';

// Types
import { JobFitAnalysisData } from './types';

export default function ResumeAnalyzerPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) router.push('/login');
  }, [router]);

  // UI State
  const [activeTab, setActiveTab] = useState<NavTabId>('cv-scoring');
  const [error, setError] = useState<string | null>(null);

  // CV State
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [fileName, setFileName] = useState('');
  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);

  // Overlay State System
  const [overlay, setOverlay] = useState<{ isOpen: boolean; type: 'cv' | 'jobfit'; isReady: boolean }>({
    isOpen: false,
    type: 'cv',
    isReady: false
  });
  const [pendingParsed, setPendingParsed] = useState<ParsedResume | null>(null);
  const [pendingJobFit, setPendingJobFit] = useState<any | null>(null);

  // Job Fit State
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobFitActiveTab, setJobFitActiveTab] = useState<'url' | 'text'>('url');
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [jobFitData, setJobFitData] = useState<JobFitAnalysisData & { id?: string } | null>(null);
  const [jobFitHistory, setJobFitHistory] = useState<JobFitHistoryItem[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const [resHistory, jfHistory] = await Promise.all([
        getResumeHistory(),
        getJobFitHistory().catch(() => [])
      ]);
      setHistory(resHistory);
      setJobFitHistory(jfHistory);
      // Initialize selectedResumeId with the latest resume from history if not already set
      if (resHistory.length > 0 && !selectedResumeId) {
        setSelectedResumeId(resHistory[0].id);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    }
  }, [selectedResumeId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // CV Actions
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
    setError(null);
    setFileName(item.fileName);
    try {
      const data = await getResumeById(item.id);
      setParsed(data);
      setSelectedResumeId(item.id); // Set selected resume when loaded from history
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err: any) {
      setError('Failed to load analysis from history.');
    }
  };

  const handleResetCV = () => {
    setParsed(null);
    setError(null);
  };

  const handleDeleteHistory = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis summary?')) return;
    try {
      await deleteResume(id);
      setHistory(prev => prev.filter(h => h.id !== id));
      if (selectedResumeId === id) {
        setSelectedResumeId(null); // Clear selected resume if deleted
      }
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  // Job Fit Actions
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
      setPendingJobFit({ ...data.analysis, id: data.id });
      setOverlay(prev => ({ ...prev, isReady: true }));
      loadHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to analyze job fit. You may need to upload a resume first.');
      setOverlay(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleOverlayComplete = () => {
    if (overlay.type === 'cv' && pendingParsed) {
      setParsed(pendingParsed);
    } else if (overlay.type === 'jobfit' && pendingJobFit) {
      setJobFitData(pendingJobFit);
    }
    setOverlay(prev => ({ ...prev, isOpen: false, isReady: false }));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLoadJobFitFromHistory = async (item: JobFitHistoryItem) => {
    setError(null);
    try {
      const result = await getJobFitById(item.id);
      setJobFitData({ ...result.analysis, id: result.id });
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err: any) {
      setError('Failed to load job fit analysis from history.');
    }
  };

  const handleDeleteJobFit = async (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this job fit result?')) return;
    try {
      await deleteJobFit(id);
      setJobFitHistory(prev => prev.filter(h => h.id !== id));
      if (jobFitData?.id === id) setJobFitData(null);
    } catch (err) {
      alert('Failed to delete job fit result.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Title Area */}
      {!parsed && !jobFitData && (
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {activeTab === 'cv-scoring' ? 'Resume AI Analysis' : 'Job Match Analysis'}
          </h1>
          <p className="mt-2 text-slate-500 font-semibold text-sm sm:text-base">
            {activeTab === 'cv-scoring' 
              ? 'Get deep AI-powered insights on your CV structure' 
              : 'Measure your fit against any job description'}
          </p>
        </div>
      )}

      <div className="max-w-[1500px] w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-start relative">
        {/* Left Navigation Sidebar */}
        {!parsed && !jobFitData && (
          <div className="lg:sticky lg:top-8 shrink-0 w-full lg:w-auto self-start">
             <SidebarNav activeTab={activeTab} onSelect={setActiveTab} />
          </div>
        )}

        {/* Right Content Area */}
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

          {activeTab === 'cv-scoring' && (
             <div className="w-full animate-in fade-in zoom-in-95 duration-300">
               {parsed ? (
                 <div className="w-full flex flex-col items-center">
                   <div className="w-full max-w-7xl flex justify-start mb-4">
                     <button 
                       onClick={handleResetCV}
                       className="inline-flex items-center text-[15px] font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors px-5 py-2 rounded-2xl shadow-sm"
                     >
                       ← Back to dashboard
                     </button>
                   </div>
                   <div className="w-full max-w-7xl">
                     <ResumeDisplay
                       data={parsed}
                       fileName={fileName}
                       onReset={handleResetCV}
                     />
                   </div>
                 </div>
               ) : (
                 <CVScoringTab 
                   history={history} 
                   onUpload={handleFile} 
                   onSelectExisting={handleLoadFromHistory} 
                   isUploading={overlay.isOpen} 
                   onDeleteHistory={handleDeleteHistory}
                 />
               )}
             </div>
          )}

          {activeTab === 'job-fit' && (
             <div className="w-full animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center">
               {jobFitData ? (
                 <div className="w-full flex flex-col items-center">
                   <div className="w-full max-w-7xl flex justify-start mb-4">
                     <button 
                       onClick={() => setJobFitData(null)}
                       className="inline-flex items-center text-[15px] font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors px-5 py-2 rounded-2xl shadow-sm"
                     >
                       ← Back to dashboard
                     </button>
                   </div>
                   <div className="w-full max-w-7xl">
                     <JobFitReport 
                       data={jobFitData} 
                       onBack={() => setJobFitData(null)} 
                       onDelete={(id) => handleDeleteJobFit(null, id)}
                     />
                   </div>
                 </div>
               ) : (
                 <div className="w-full flex flex-col items-center gap-10">
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
                   
                   {jobFitHistory.length > 0 && (
                     <div className="w-full max-w-5xl">
                       <h3 className="text-lg font-black text-slate-900 mb-4 ml-1">Recent Job Fit Analyses</h3>
                       <JobFitHistoryList
                         history={jobFitHistory}
                         onLoad={handleLoadJobFitFromHistory}
                         onDelete={handleDeleteJobFit}
                       />
                     </div>
                   )}
                 </div>
               )}
             </div>
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
