import React from 'react';
import { JobFitHistoryItem } from '../../../services/resumeService';
import { Target, Trash2, ChevronRight, Clock, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

interface JobFitHistoryListProps {
  history: JobFitHistoryItem[];
  onLoad: (item: JobFitHistoryItem) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export function JobFitHistoryList({ history, onLoad, onDelete }: JobFitHistoryListProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-3xl hover:border-slate-300 transition-colors group gap-4"
        >
          {/* Left section: Icon and Info */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 shrink-0 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm font-black text-sm uppercase overflow-hidden">
              {item.companyName ? item.companyName.substring(0, 2) : <Building2 className="w-6 h-6" />}
            </div>

            <div className="flex flex-col mb-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-[16px] text-slate-900 tracking-tight">
                  {item.jobTitle || 'Untitled Role'}
                </h3>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
              <p className="text-[13px] font-semibold text-slate-500 mt-1">
                {item.companyName || 'Unknown Company'} <span className="mx-2 opacity-40">•</span>
                {new Date(item.analyzedAt).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Right section: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLoad(item)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 rounded-2xl font-bold text-[13px] transition-colors"
            >
              View <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
            <div className="w-1 h-3 border-r border-slate-200 mx-1"></div>
            <button
              onClick={(e) => onDelete(e, item.id)}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
              title="Delete Analysis"
            >
              <Trash2 className="w-5 h-5 pointer-events-none" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
