import { useMemo } from 'react';
import { ArrowRight, Calendar as CalendarIcon, CalendarDays, Check, Clock, Info, Loader2, Minus, Plus, RotateCcw, Search, Sparkles, Users, UserCheck, Eye, BookOpen } from 'lucide-react';
import { CourseSession, DayOfWeek, RecommendationResult, SchedulePreferences } from '@/types/scheduling';

const canonicalCourseKey = (s: string) => {
    return s
        .toLowerCase()
        .replace(/[\u2010-\u2015]/g, '-') // normalize hyphens
        .replace(/\b(and|&|of|the|in|with|to|concepts?|concept|computer|com)\b/g, ' ')
        .split(/[^a-z0-9]/)
        .filter(w => w.length >= 4 || /^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(w))
        .join('');
};

export default function ScheduleAssistantTab({
    useMyData,
    setUseMyData,
    LEVELS,
    prefs,
    setPrefs,
    query,
    setQuery,
    instrQuery,
    setInstrQuery,
    displayCoursesByCategory,
    advisorSelectedNames,
    setAdvisorSelectedNames,
    manualSelectedNames,
    rlRecommendedNames,
    toggleCourseName,
    displayInstructors,
    toggleInstructor,
    toggleDay,
    DAYS,
    computing,
    results,
    appliedCourses,
    isDirty,
    handleReset,
    handleGetRecommendations,
    setPreviewBlock,
    prefsAreDefault,
}: {
    useMyData: boolean | null;
    setUseMyData: React.Dispatch<React.SetStateAction<boolean | null>>;
    LEVELS: { id: 'FR' | 'JR' | 'SO' | 'SR' | 'ALL'; label: string; desc: string }[];
    prefs: SchedulePreferences;
    setPrefs: React.Dispatch<React.SetStateAction<SchedulePreferences>>;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    instrQuery: string;
    setInstrQuery: React.Dispatch<React.SetStateAction<string>>;
    displayCoursesByCategory: Record<string, string[]>;
    advisorSelectedNames: string[];
    setAdvisorSelectedNames: React.Dispatch<React.SetStateAction<string[]>>;
    manualSelectedNames: string[];
    rlRecommendedNames: string[];
    toggleCourseName: (name: string) => void;
    displayInstructors: string[];
    toggleInstructor: (i: string) => void;
    toggleDay: (d: DayOfWeek) => void;
    DAYS: DayOfWeek[];
    computing: boolean;
    results: RecommendationResult[];
    appliedCourses: string[];
    isDirty: boolean;
    handleReset: () => void;
    handleGetRecommendations: (matchCoursesOnly?: boolean) => void;
    setPreviewBlock: React.Dispatch<React.SetStateAction<CourseSession[] | null>>;
    prefsAreDefault: boolean;
}) {
    const selectedCourses = useMyData ? advisorSelectedNames : manualSelectedNames;

    const filteredResults = useMemo(() => {
        if (!results) return [];

        const currentSelected = useMyData ? advisorSelectedNames : manualSelectedNames;
        const filterKeys = appliedCourses.length > 0
            ? appliedCourses.map(canonicalCourseKey)
            : currentSelected.map(canonicalCourseKey);

        return results.filter(rec => {
            // 1. Instructor filter
            if (instrQuery && !rec.block.courses.some((c: CourseSession) =>
                c.instructor.toLowerCase().includes(instrQuery.toLowerCase())
            )) return false;

            // 2. Strict Course Match Filter: Must have at least one of the selected courses
            if (filterKeys.length > 0) {
                const blockKeys = rec.block.courses.map((c: CourseSession) => canonicalCourseKey(c.courseName));
                const hasMatch = filterKeys.some(n => blockKeys.includes(n));
                if (!hasMatch) return false;
            }

            return true;
        });
    }, [results, instrQuery, appliedCourses, advisorSelectedNames, manualSelectedNames, useMyData]);

    return (
        <div className="w-full">
            {/* Single-page form header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3 pl-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center">
                        <Sparkles size={18} className="text-[#2F80ED]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5 text-slate-900">
                            <h2 className="text-lg font-bold text-slate-900 leading-tight">Schedule Assistant</h2>
                            <div className="relative group flex items-center mt-0.5">
                                <Info size={15} className="text-slate-400 hover:text-blue-500 cursor-default transition-colors" />
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-white text-slate-600 text-[13px] leading-relaxed p-3.5 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-normal">
                                    Our smart engine analyzes your preferred courses, instructor ratings, and gap constraints to find the most balanced schedule combinations automatically.
                                </div>
                            </div>
                        </div>
                        <p className="text-[13px] font-medium text-slate-500 mt-0.5">Automated conflict-free scheduling based on your profile preferences.</p>
                    </div>
                </div>
            </div>

            
            {
                <div className="space-y-6">

                    {/* Two-column form area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-full space-y-5">

                            {/* Data Source selector */}
                            <div>
                                <div className="flex items-center gap-2 mb-2.5">
                                    <label className="text-sm font-bold text-slate-700 block">Course Source</label>
                                    <div className="relative group flex items-center">
                                        <Info size={14} className="text-slate-300 hover:text-indigo-500 transition-colors" />
                                        <div className="absolute left-0 top-full mt-2 w-64 bg-white text-slate-600 text-[12px] leading-snug p-3 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-normal">
                                            Choose between AI-suggested courses based on your level/advisor or hand-pick from the full catalog.
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <button
                                        className={`w-full flex items-center gap-3 rounded-xl p-3.5 border-2 text-left transition-all ${useMyData === true ? 'border-[#2F80ED] bg-blue-50/40' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                                        onClick={() => {
                                            setUseMyData(true);
                                        }}
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <UserCheck size={18} className="text-[#2F80ED]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">Sync with My Advisor</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Auto-fill courses based on your recent advisor discussion</p>
                                        </div>
                                        {useMyData === true && <div className="w-5 h-5 rounded-full bg-[#2F80ED] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white" /></div>}
                                    </button>
                                    <button
                                        className={`w-full flex items-center gap-3 rounded-xl p-3.5 border-2 text-left transition-all ${useMyData === false ? 'border-[#2F80ED] bg-blue-50/40' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                                        onClick={() => setUseMyData(false)}
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Search size={18} className="text-[#2F80ED]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">Browse Catalog</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Pick specific courses from the full semester list</p>
                                        </div>
                                        {useMyData === false && <div className="w-5 h-5 rounded-full bg-[#2F80ED] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white" /></div>}
                                    </button>
                                </div>
                            </div>

                            {/* Level picker â€“ only for manual */}
                            {useMyData === false && (
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2.5">Academic Level</label>
                                    <div className="flex flex-wrap gap-2">
                                        {LEVELS.map(l => {
                                            const on = prefs.level === l.id;
                                            return (
                                                <button
                                                    key={l.id}
                                                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${on ? 'border-[#2F80ED] bg-[#2F80ED] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                                                    onClick={() => setPrefs(p => ({ ...p, level: l.id }))}
                                                >
                                                    {l.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Course selection */}
                            {useMyData !== null && (
                                <div>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <label className="text-sm font-bold text-slate-700">
                                            {useMyData ? 'Eligible Courses' : 'Browse Courses'}
                                        </label>
                                        {useMyData ? (
                                            advisorSelectedNames.length > 0 && <span className="text-xs font-semibold text-[#2F80ED]">{advisorSelectedNames.length} selected</span>
                                        ) : (
                                            manualSelectedNames.length > 0 && <span className="text-xs font-semibold text-[#2F80ED]">{manualSelectedNames.length} selected</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 mb-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                        <Search size={14} className="text-slate-400" />
                                        <input
                                            type="text"
                                            className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                                            placeholder="Search courses"
                                            value={query}
                                            onChange={e => setQuery(e.target.value)}
                                        />
                                        {query && <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 text-xs">âœ•</button>}
                                    </div>

                                    <div className={`${useMyData ? 'flex-1' : 'max-h-[310px]'} overflow-y-auto pr-1 scrollbar-hide space-y-3`}>
                                        {Object.entries(displayCoursesByCategory).map(([category, names]) => (
                                            <div key={category}>
                                                <div className="flex items-center justify-between mb-1.5 mt-2 first:mt-0">
                                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{category}</h3>
                                                    {category === 'Recommended for You' && (
                                                        <button
                                                            onClick={() => {
                                                                const allSelected = names.every((n: string) => advisorSelectedNames.includes(n));
                                                                if (allSelected) {
                                                                    setAdvisorSelectedNames(prev => prev.filter(x => !names.includes(x)));
                                                                } else {
                                                                    setAdvisorSelectedNames(prev => [...new Set([...prev, ...names])]);
                                                                }
                                                            }}
                                                            className="text-[10px] font-extrabold text-[#2F80ED] hover:text-blue-700 transition-colors"
                                                        >
                                                            {names.every((n: string) => advisorSelectedNames.includes(n)) ? 'Deselect All' : 'Select All'}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="space-y-1.5">
                                                    {names.map((name: string) => {
                                                        const isSelected = useMyData ? advisorSelectedNames.includes(name) : manualSelectedNames.includes(name);
                                                        const isRecommended = rlRecommendedNames.includes(name);
                                                        return (
                                                            <button
                                                                key={name}
                                                                className={`w-full flex items-center gap-2.5 rounded-xl p-2.5 border text-left transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                                                onClick={() => toggleCourseName(name)}
                                                            >
                                                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${isSelected ? 'border-[#2F80ED] bg-[#2F80ED]' : 'border-slate-300'}`}>
                                                                    {isSelected && <Check size={10} className="text-white" />}
                                                                </div>
                                                                <span className={`text-sm font-medium flex-1 ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{name}</span>
                                                                {isRecommended && (
                                                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                                                        Suggested ✧
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                        {Object.keys(displayCoursesByCategory).length === 0 && (
                                            <p className="text-center text-sm text-slate-400 py-8">No courses match your search.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-full space-y-5">

                            {/* Instructors */}
                            <div>
                                <div className="flex items-center gap-2 mb-2.5">
                                    <Users size={14} className="text-[#2F80ED]" />
                                    <label className="text-sm font-bold text-slate-700">Preferred Instructors</label>
                                    {prefs.preferredInstructors.length > 0 && <span className="text-xs font-semibold text-[#2F80ED] ml-auto">{prefs.preferredInstructors.length} selected</span>}
                                </div>
                                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 mb-3 focus-within:border-blue-300 transition-all">
                                    <Search size={13} className="text-slate-400" />
                                    <input type="text" className="flex-1 text-xs bg-transparent outline-none text-slate-800 placeholder:text-slate-400" placeholder="Search instructors" value={instrQuery} onChange={e => setInstrQuery(e.target.value)} />
                                    {instrQuery && <button onClick={() => setInstrQuery('')} className="text-slate-400 text-xs">âœ•</button>}
                                </div>
                                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-auto">
                                    {displayInstructors.slice(0, 40).map(instr => {
                                        const on = prefs.preferredInstructors.includes(instr);
                                        return (
                                            <button key={instr} className={`px-2.5 py-1 rounded-xl border text-xs font-medium transition-all ${on ? 'border-[#2F80ED] bg-[#2F80ED] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`} onClick={() => toggleInstructor(instr)}>
                                                {instr}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Campus Days */}
                            <div>
                                <div className="flex items-center gap-2 mb-2.5">
                                    <CalendarDays size={14} className="text-[#2F80ED]" />
                                    <label className="text-sm font-bold text-slate-700">Campus Days</label>
                                    <div className="relative group flex items-center">
                                        <Info size={13} className="text-slate-300 hover:text-blue-500 transition-colors" />
                                        <div className="absolute left-0 top-full mt-2 w-60 bg-white text-slate-600 text-[12px] leading-snug p-3 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-normal">
                                            Total days you prefer to be on campus.
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-3">
                                    {(['count', 'specific'] as const).map(mode => {
                                        const on = prefs.dayMode === mode;
                                        return (
                                            <button key={mode} className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all ${on ? 'border-[#2F80ED] bg-[#2F80ED] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`} onClick={() => setPrefs(p => ({ ...p, dayMode: mode }))}>
                                                {mode === 'count' ? '# of Days' : 'Specific Days'}
                                            </button>
                                        );
                                    })}
                                </div>
                                {prefs.dayMode === 'count' ? (
                                    <div className="flex items-center justify-between bg-slate-50/80 border border-slate-100 p-1 rounded-2xl w-64 mx-auto px-2">
                                        <button
                                            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-[#2F80ED] hover:border-blue-200 transition-all shadow-sm active:scale-95"
                                            onClick={() => setPrefs(p => ({ ...p, numPreferredDays: Math.max(1, (p.numPreferredDays ?? 3) - 1) }))}
                                        >
                                            <Minus size={14} strokeWidth={3} />
                                        </button>
                                        <div className="flex flex-col items-center">
                                            <span className="text-base font-bold text-slate-800 leading-none">{prefs.numPreferredDays ?? 3}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Days</span>
                                        </div>
                                        <button
                                            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-[#2F80ED] hover:border-blue-200 transition-all shadow-sm active:scale-95"
                                            onClick={() => setPrefs(p => ({ ...p, numPreferredDays: Math.min(6, (p.numPreferredDays ?? 3) + 1) }))}
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {DAYS.map(d => {
                                            const on = prefs.preferredDays.includes(d);
                                            return (
                                                <button key={d} className={`px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all ${on ? 'border-[#2F80ED] bg-[#2F80ED] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`} onClick={() => toggleDay(d)}>
                                                    {d.slice(0, 3)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Hard Limits */}
                            <div className="space-y-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-slate-700 block mb-3 flex items-center gap-2">
                                        <CalendarIcon size={14} className="text-[#2F80ED]" />
                                        Max Days <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-md border border-red-100 uppercase tracking-wide">Hard Limit</span>
                                        <div className="relative group flex items-center">
                                            <Info size={13} className="text-slate-300 hover:text-blue-500 transition-colors" />
                                            <div className="absolute left-0 top-full mt-2 w-60 bg-white text-slate-600 text-[12px] leading-snug p-3 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-normal">
                                                Strict limit on the number of days per week.
                                            </div>
                                        </div>
                                    </label>
                                    <div className="flex items-center justify-between bg-slate-50/80 border border-slate-100 p-1 rounded-2xl w-64 mx-auto px-2">
                                        <button
                                            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm active:scale-95"
                                            onClick={() => setPrefs(p => ({ ...p, maxDaysPerWeek: Math.max(1, p.maxDaysPerWeek - 1) }))}
                                        >
                                            <Minus size={14} strokeWidth={3} />
                                        </button>
                                        <div className="flex flex-col items-center">
                                            <span className="text-base font-bold text-slate-800 leading-none">{prefs.maxDaysPerWeek}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Days/Week</span>
                                        </div>
                                        <button
                                            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm active:scale-95"
                                            onClick={() => setPrefs(p => ({ ...p, maxDaysPerWeek: Math.min(6, p.maxDaysPerWeek + 1) }))}
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock size={14} className="text-[#2F80ED]" />
                                        <label className="text-sm font-bold text-slate-700">Max Gap <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-md border border-red-100 uppercase tracking-wide ml-1">Hard Limit</span></label>
                                        <div className="relative group flex items-center">
                                            <Info size={13} className="text-slate-300 hover:text-blue-500 transition-colors" />
                                            <div className="absolute left-0 top-full mt-2 w-60 bg-white text-slate-600 text-[12px] leading-snug p-3 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-normal">
                                                Strict limit on idle hours between classes.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-slate-50/80 border border-slate-100 p-1 rounded-2xl w-64 mx-auto px-2">
                                        <button
                                            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm active:scale-95"
                                            onClick={() => setPrefs(p => ({ ...p, maxGapHours: Math.max(0, Math.round((p.maxGapHours - 0.5) * 10) / 10) }))}
                                        >
                                            <Minus size={14} strokeWidth={3} />
                                        </button>
                                        <div className="flex flex-col items-center">
                                            <span className="text-base font-bold text-slate-800 leading-none">{prefs.maxGapHours === 0 ? 'None' : `${prefs.maxGapHours}h`}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{prefs.maxGapHours === 0 ? 'No Limit' : 'Max Gap'}</span>
                                        </div>
                                        <button
                                            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm active:scale-95"
                                            onClick={() => setPrefs(p => ({ ...p, maxGapHours: Math.min(8, Math.round((p.maxGapHours + 0.5) * 10) / 10) }))}
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Time Range */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={14} className="text-[#2F80ED]" />
                                    <label className="text-sm font-bold text-slate-700">Preferred Time Range</label>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Earliest Start</label>
                                            <input
                                                type="time"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all"
                                                value={prefs.earliestTime}
                                                onChange={e => setPrefs(p => ({ ...p, earliestTime: e.target.value }))}
                                            />
                                        </div>
                                        <div className="pt-5 text-slate-300">
                                            <ArrowRight size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Latest End</label>
                                            <input
                                                type="time"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all"
                                                value={prefs.latestTime}
                                                onChange={e => setPrefs(p => ({ ...p, latestTime: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className={`flex items-center justify-center gap-2.5 py-3 px-8 rounded-xl text-sm font-bold text-white transition-all shadow-md active:scale-95 ${computing || useMyData === null || (useMyData ? advisorSelectedNames.length === 0 : manualSelectedNames.length === 0)
                                ? 'bg-slate-300 cursor-not-allowed opacity-70'
                                : results.length > 0 && !isDirty
                                    ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-200/50'
                                    : 'bg-[#2F80ED] hover:bg-blue-600 shadow-blue-200/50'}`}
                            disabled={computing || useMyData === null || (useMyData ? advisorSelectedNames.length === 0 : manualSelectedNames.length === 0)}
                            onClick={results.length > 0 && !isDirty ? handleReset : () => handleGetRecommendations(false)}
                        >
                            {computing ? (
                                <><Loader2 size={16} className="animate-spin" /> Computing…</>
                            ) : results.length > 0 && !isDirty ? (
                                <><RotateCcw size={16} /> Reset Assistant</>
                            ) : isDirty ? (
                                <><Sparkles size={16} /> Update Recommendations</>
                            ) : (
                                <><Sparkles size={16} /> Get Recommendations</>
                            )}
                        </button>
                    </div>

                    
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-500" style={{ minHeight: 440 }}>
                        {/* Section Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 bg-slate-50/40">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center">
                                    <Sparkles size={18} className="text-[#2F80ED]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-bold text-slate-900 leading-tight">Recommended Blocks</h3>
                                        <div className="relative group flex items-center mt-0.5">
                                            <Info size={14} className="text-slate-300 hover:text-blue-500 transition-colors" />
                                            <div className="absolute left-0 top-full mt-2 w-64 bg-white text-slate-600 text-[12px] leading-snug p-3 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none font-normal">
                                                These blocks are calculated based on your course priorities and scheduling constraints.
                                            </div>
                                        </div>
                                    </div>
                                    {!computing && results.length > 0 ? (
                                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-medium text-slate-500">
                                            <span>{filteredResults.length} match{filteredResults.length !== 1 ? 'es' : ''} found</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-[#2F80ED] font-bold">Best {filteredResults[0]?.matchScore}% Match</span>
                                        </div>
                                    ) : (
                                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                                            {computing ? 'AI is analyzing preferences...' : 'Results will appear here'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5">
                            {computing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className="bg-white rounded-2xl border border-slate-50 p-5 animate-pulse">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-100" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3.5 bg-slate-100 rounded w-1/2" />
                                                    <div className="h-2.5 bg-slate-50 rounded w-3/4" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[0, 1, 2].map(j => <div key={j} className="h-10 bg-slate-50 rounded-xl" />)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[340px] text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-blue-100/30 blur-2xl rounded-full" />
                                        <Search size={72} strokeWidth={1.5} className="text-[#84828f] relative opacity-70" />
                                        <div className="absolute -top-1 -right-1">
                                            <Sparkles size={24} className="text-blue-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#00103e] mb-2">No Recommendations Yet</h3>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredResults.length === 0 ? (
                                        <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
                                            <Search size={48} strokeWidth={1.5} className="text-slate-300 mb-4" />
                                            <h4 className="text-base font-bold text-slate-600 mb-1">No blocks found for your selected courses</h4>
                                            <p className="text-[12px] text-slate-400 font-medium">Try selecting different courses or adjusting preferences.</p>
                                        </div>
                                    ) : (
                                        filteredResults.map((rec, idx) => {
                                            const uniqueDaysList = Array.from(new Set(rec.block.courses.map((c: CourseSession) => c.day))) as DayOfWeek[];
                                            const blockCourseNames = rec.block.courses.map((c: CourseSession) => c.courseName);
                                            const filterKeys = appliedCourses.length > 0
                                                ? appliedCourses.map(canonicalCourseKey)
                                                : selectedCourses.map(canonicalCourseKey);
                                            const blockKeys = blockCourseNames.map(canonicalCourseKey);
                                            const matchedCount = filterKeys.filter(n => blockKeys.includes(n)).length;
                                            const displayScore = prefsAreDefault && filterKeys.length > 0
                                                ? Math.round((matchedCount / filterKeys.length) * 100)
                                                : rec.matchScore;

                                            return (
                                                <div key={rec.block.blockId} className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
                                                    {/* Card Header matching BlockCard */}
                                                    <div className="flex items-start justify-between mb-2.5">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-500">#{idx + 1}</span>
                                                                <h4 className="text-base font-bold text-slate-900 truncate">{rec.block.blockId}</h4>
                                                                {/* Smart Explanation Tooltip moved next to Title */}
                                                                <div className="group relative">
                                                                    <div className="p-1 cursor-pointer text-slate-400 hover:text-[#2F80ED] transition-colors">
                                                                        <Info size={14} strokeWidth={2.5} />
                                                                    </div>
                                                                    <div className="absolute left-0 bottom-full mb-2 w-80 p-4 bg-white text-slate-600 text-[11px] rounded-2xl shadow-2xl border border-slate-100 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                                                                        <div className="font-bold mb-2 text-[#2F80ED] flex items-center gap-1.5 border-b border-blue-50 pb-1.5">
                                                                            <Sparkles size={12} /> AI Analysis
                                                                        </div>
                                                                        <p className="leading-relaxed font-medium">
                                                                            {(() => {
                                                                                const matched = selectedCourses.filter(n => blockKeys.includes(canonicalCourseKey(n)));
                                                                                const count = matched.length;
                                                                                let msg = `This schedule covers ${count} out of your ${selectedCourses.length} selected courses. `;
                                                                                if (count > 0) msg += `Matched: ${matched.join(', ')}. `;
                                                                                if (rec.breakdown.compactness > 0.8) msg += "Highly optimized with minimal gaps. ";
                                                                                if (rec.breakdown.similarity > 0.6) msg += "Aligned with advisor track.";
                                                                                return msg;
                                                                            })()}
                                                                        </p>
                                                                        <div className="absolute top-full left-2 border-8 border-transparent border-t-white" />
                                                                        <div className="absolute top-full left-2 border-8 border-transparent border-t-slate-100 -z-10 translate-y-[1px]" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2.5 text-[12px] text-slate-500">
                                                                <span className="flex items-center gap-1 font-medium">
                                                                    <BookOpen size={13} strokeWidth={2} />
                                                                    {rec.block.totalCredits} credits
                                                                </span>
                                                                <span className="flex items-center gap-1 font-medium">
                                                                    <CalendarIcon size={13} strokeWidth={2} />
                                                                    {uniqueDaysList.length} days
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1.5">
                                                            <div className="px-2.5 py-1 rounded-xl text-[12px] font-bold shadow-sm bg-blue-50 text-[#2F80ED] border border-blue-100">
                                                                {displayScore}% Match
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Day Badges style from BlockCard */}
                                                    <div className="flex flex-wrap gap-1 mb-4">
                                                        {uniqueDaysList.map(d => (
                                                            <span key={d} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                                                                {d.slice(0, 3)}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Metrics Breakdown */}
                                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                                        {[
                                                            { label: 'Similar', value: rec.breakdown.similarity },
                                                            { label: 'Cover', value: rec.breakdown.coverage },
                                                            { label: 'Compact', value: rec.breakdown.compactness },
                                                        ].map(b => {
                                                            const pct = Math.round(b.value * 100);
                                                            return (
                                                                <div key={b.label} className="bg-slate-50/50 rounded-xl p-2 h-14 flex flex-col justify-between border border-slate-100/50">
                                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{b.label}</p>
                                                                    <div className="flex items-end justify-between gap-1.5">
                                                                        <p className="text-xs font-bold text-slate-700 leading-none">{pct}%</p>
                                                                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden mb-1">
                                                                            <div className="h-full rounded-full bg-[#2F80ED]" style={{ width: `${pct}%` }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Reasons */}
                                                    <div className="flex flex-wrap gap-1.5 mb-4 opacity-80">
                                                        {rec.reasons.slice(0, 3).map((r: string, i: number) => (
                                                            <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-[9px] text-slate-500 font-bold border border-slate-200/50 w-fit">
                                                                <Check size={8} strokeWidth={3} className="text-[#2F80ED]" /> {r}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Recommendation Button Style matching BlockCard */}
                                                    <button
                                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-[#2F80ED] text-[#2F80ED] hover:text-white text-sm font-bold transition-all duration-300 shadow-sm"
                                                        onClick={() => setPreviewBlock(rec.block.courses)}
                                                    >
                                                        <Eye size={15} strokeWidth={2.5} />
                                                        Preview Schedule
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}

                                </div>

                            )}

                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

