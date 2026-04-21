import CourseDetailModal from '@/components/scheduling/CourseDetailModal';
import ScheduleGrid from '@/components/scheduling/ScheduleGrid';
import { CourseSession } from '@/types/scheduling';

export default function SchedulePreviewModal({
    previewBlock,
    setPreviewBlock,
    previewCourse,
    setPreviewCourse,
}: {
    previewBlock: CourseSession[] | null;
    setPreviewBlock: (b: CourseSession[] | null) => void;
    previewCourse: CourseSession | null;
    setPreviewCourse: (c: CourseSession | null) => void;
}) {
    return (
        <>
            {previewBlock && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={(e) => { if (e.target === e.currentTarget) setPreviewBlock(null); }}
                >
                    <div className="bg-white rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.3)] w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-400">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Schedule Preview</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Smart Recommendation</p>
                            </div>
                            <button
                                onClick={() => setPreviewBlock(null)}
                                className="px-3 py-1 rounded-lg text-sm font-semibold text-[#2F80ED] hover:bg-blue-50 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 scrollbar-hide">
                            <ScheduleGrid
                                courses={previewBlock}
                                onCoursePress={c => setPreviewCourse(c)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {previewCourse && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
                    onClick={() => setPreviewCourse(null)}
                >
                    <div className="relative w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <CourseDetailModal
                            course={previewCourse}
                            visible={!!previewCourse}
                            onClose={() => setPreviewCourse(null)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

