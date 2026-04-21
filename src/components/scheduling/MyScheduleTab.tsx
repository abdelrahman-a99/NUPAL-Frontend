import { useState } from 'react';
import { Calendar as CalendarIcon, CalendarDays, Info, List, ShoppingCart } from 'lucide-react';
import { MY_SCHEDULE_COURSES } from '@/data/schedulingData';
import { CourseSession } from '@/types/scheduling';
import ScheduleGrid from '@/components/scheduling/ScheduleGrid';
import ScheduleList from '@/components/scheduling/ScheduleList';
import CourseDetailModal from '@/components/scheduling/CourseDetailModal';

export default function MyScheduleTab({
    viewMode,
    setViewMode,
}: {
    viewMode: 'list' | 'grid';
    setViewMode: (m: 'list' | 'grid') => void;
}) {
    const [selectedCourse, setSelectedCourse] = useState<CourseSession | null>(null);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 pl-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center">
                        <ShoppingCart size={18} className="text-[#2F80ED]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 text-slate-900">
                            <h2 className="text-lg font-bold leading-tight">My Schedule</h2>
                            <div className="relative group flex items-center mt-0.5 ml-1">
                                <Info size={16} className="text-slate-400 hover:text-blue-500 cursor-default transition-colors" />
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-white text-slate-600 text-[13px] leading-relaxed p-3.5 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                                    If you can&apos;t see a course selected above, then it probably has no schedule. If not sure, search for the course using the Blocks Explorer search and try again. If all fails, report it in the main page.
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[13px] font-medium text-slate-500">
                            {MY_SCHEDULE_COURSES.length === 0 ? (
                                <span>Not configured yet</span>
                            ) : (
                                <>
                                    <span className="text-slate-700 font-semibold">{MY_SCHEDULE_COURSES.length} <span className="font-medium text-slate-500">Courses</span></span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-[#2F80ED] font-semibold">{MY_SCHEDULE_COURSES.reduce((s, c) => s + (c.credits || 0), 0)} <span className="font-medium text-blue-500/80">Credits</span></span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-indigo-600 font-semibold">{new Set(MY_SCHEDULE_COURSES.map(c => c.day)).size} <span className="font-medium text-indigo-500/80">Days</span></span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm">
                    <button
                        className={`px-4 py-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#2F80ED] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                        onClick={() => setViewMode('list')}
                    >
                        <List size={18} strokeWidth={2} />
                    </button>
                    <button
                        className={`px-4 py-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#2F80ED] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <CalendarIcon size={18} strokeWidth={2} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ minHeight: 400 }}>
                {MY_SCHEDULE_COURSES.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                        <CalendarDays size={72} strokeWidth={1.5} className="text-[#84828f] mb-5 opacity-80" />
                        <h3 className="text-[1.35rem] font-semibold text-[#00103e] mb-2 tracking-tight">No Courses Added</h3>
                        <p className="text-[15px] text-[#5c5c6b] max-w-md">
                            You haven&apos;t added any courses to your schedule. Try exploring blocks or getting a smart recommendation.
                        </p>
                    </div>
                ) : viewMode === 'list' ? (
                    <ScheduleList courses={MY_SCHEDULE_COURSES} onCoursePress={setSelectedCourse} />
                ) : (
                    <div className="p-4">
                        <ScheduleGrid courses={MY_SCHEDULE_COURSES} onCoursePress={setSelectedCourse} />
                    </div>
                )}
            </div>

            <CourseDetailModal
                course={selectedCourse}
                visible={!!selectedCourse}
                onClose={() => setSelectedCourse(null)}
            />
        </div>
    );
}

