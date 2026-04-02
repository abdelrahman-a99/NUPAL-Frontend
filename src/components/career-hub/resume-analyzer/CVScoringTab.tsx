import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2 } from 'lucide-react';
import { ResumeHistoryItem } from '@/services/resumeService';

interface CVScoringTabProps {
  history: ResumeHistoryItem[];
  onUpload: (file: File) => void;
  onSelectExisting: (item: ResumeHistoryItem) => void;
  isUploading: boolean;
  onDeleteHistory?: (e: React.MouseEvent, id: string) => void;
}

export function CVScoringTab({ history, onUpload, onSelectExisting, isUploading, onDeleteHistory }: CVScoringTabProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedHoverId, setSelectedHoverId] = React.useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 animate-in fade-in duration-500 w-full max-w-5xl">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Resume for Checking</h2>
        <p className="text-sm font-semibold text-slate-400 mt-2 tracking-wide">Upload a new document or choose from your history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Upload Zone */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 tracking-tight ml-1">Upload New Resume</h3>
          <div
            className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[220px] ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              disabled={isUploading}
            />
            <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-slate-800">Upload Resume</p>
            <p className="text-xs font-semibold text-slate-400 mt-1.5 text-center">Drag and drop your resume here, or click to browse</p>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-4">Supports PDF files up to 5MB</p>
          </div>
        </div>

        {/* Existing Resumes */}
        <div className="space-y-4 flex flex-col">
          <h3 className="text-sm font-black text-slate-900 tracking-tight ml-1 flex justify-between">
            <span>Existing Resumes</span>
            <span className="text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md text-xs">{history.length}</span>
          </h3>
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 overflow-y-auto max-h-[220px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] scrollbar-thin scrollbar-thumb-slate-200">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <FileText className="w-8 h-8 opacity-20 mb-2" />
                <p className="text-xs font-bold uppercase tracking-wider">No existing resumes</p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectExisting(item)}
                    onMouseEnter={() => setSelectedHoverId(item.id)}
                    onMouseLeave={() => setSelectedHoverId(null)}
                    className="w-full text-left bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md p-4 rounded-2xl transition-all group flex items-center gap-4 relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />

                    <div className="p-2.5 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 rounded-xl transition-colors shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="font-bold text-[15px] text-slate-800 truncate group-hover:text-blue-900 transition-colors">
                        {item.fileName}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        {new Date(item.analyzedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {selectedHoverId === item.id && (
                      <div className="flex items-center gap-2 shrink-0 animate-in slide-in-from-right-2 duration-200">
                        {onDeleteHistory && (
                          <button
                            onClick={(e) => onDeleteHistory(e, item.id)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                            title="Delete History"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase tracking-widest shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> View
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
