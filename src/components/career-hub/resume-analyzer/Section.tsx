import React from 'react';

export function Section({ 
  icon, 
  title, 
  children, 
  className = "", 
  iconColor = "text-blue-600" 
}: { 
  icon: React.ReactNode; 
  title: string; 
  children: React.ReactNode; 
  className?: string; 
  iconColor?: string 
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-800">
        <div className={`p-1.5 bg-white rounded-lg border border-slate-100 ${iconColor}`}>{icon}</div>
        <h2 className="text-base font-bold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
