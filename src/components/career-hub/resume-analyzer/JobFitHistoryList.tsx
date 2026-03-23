import React from 'react';
import { Target, Trash2, ChevronRight, Clock } from 'lucide-react';
import { JobFitHistoryItem } from '../../../services/resumeService';

interface JobFitHistoryListProps {
  history: JobFitHistoryItem[];
  onLoad: (item: JobFitHistoryItem) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-red-50 text-red-700 border-red-200';
  return (
    <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${color}`}>
      {score}%
    </span>
  );
}

export function JobFitHistoryList({ history, onLoad, onDelete }: JobFitHistoryListProps) {
  if (history.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto mt-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            Job Fit History
          </h3>
          <span className="ml-auto text-xs font-bold text-slate-400">{history.length} saved</span>
        </div>

        <ul className="divide-y divide-slate-100">
          {history.map((item) => (
            <li
              key={item.id}
              onClick={() => onLoad(item)}
              className="group flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 cursor-pointer transition-colors"
            >
              <ScoreBadge score={item.overallScore} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">
                  {item.jobTitle || 'Untitled Role'}
                </p>
                <p className="text-xs font-semibold text-slate-400 truncate">
                  {item.companyName || 'Unknown Company'}&nbsp;·&nbsp;
                  <Clock className="inline w-3 h-3 mb-0.5" />&nbsp;
                  {new Date(item.analyzedAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>

              <button
                onClick={(e) => onDelete(e, item.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
