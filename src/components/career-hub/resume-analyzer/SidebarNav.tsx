import React from 'react';
import { BarChart2, Target, Bot, Search, DollarSign } from 'lucide-react';

export type NavTabId = 'cv-scoring' | 'job-fit' | 'interview-prep';

interface NavItem {
  id: NavTabId;
  title: string;
  description: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'cv-scoring',
    title: 'Resume AI Analysis',
    description: 'Get deep AI-powered insights on your CV structure',
    icon: BarChart2,
  },
  {
    id: 'job-fit',
    title: 'Job Match Analysis',
    description: 'Measure your fit against any job description',
    icon: Target,
  },
  {
    id: 'interview-prep',
    title: 'Technical Interview Preparation',
    description: 'Practice with AI-driven technical interviews',
    icon: Bot,
    disabled: true,
  }
];

interface SidebarNavProps {
  activeTab: NavTabId;
  onSelect: (tab: NavTabId) => void;
}

export function SidebarNav({ activeTab, onSelect }: SidebarNavProps) {
  return (
    <nav className="w-full max-w-sm space-y-4 pr-6 shrink-0 relative">
      <div className="absolute left-10 top-10 bottom-10 w-px bg-slate-200 -z-10" />

      {NAV_ITEMS.map((item, index) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            disabled={item.disabled}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-start text-left gap-4 p-4 rounded-2xl transition-all relative hover:bg-slate-50/80 border border-transparent ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <div className={`mt-0.5 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 transition-all ${isActive
                ? 'bg-blue-600 border-blue-50 text-white'
                : 'bg-white border-slate-50 text-slate-500 hover:border-slate-100 shadow-sm'
              }`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 mt-1.5">
              <h3 className={`font-black text-sm tracking-tight ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                {item.title}
              </h3>
              <p className={`mt-0.5 text-xs font-semibold leading-relaxed ${isActive ? 'text-blue-600/80' : 'text-slate-400'}`}>
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
