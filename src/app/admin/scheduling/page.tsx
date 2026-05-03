'use client';
 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CreditCard, Search, X, Plus, Upload, Edit, Check, FileText, Trash2, MoreHorizontal } from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import AdminSelect from '@/components/admin/AdminSelect';
import ScheduleGrid from '@/components/scheduling/ScheduleGrid';
import CourseDetailPanel from '@/components/scheduling/CourseDetailModal';
import { CourseSession, DayOfWeek } from '@/types/scheduling';

const LEVELS = ['ALL', 'FR', 'SO', 'JR', 'SR'] as const;
type Level = typeof LEVELS[number];

interface Block {
    blockId: string;
    semester?: string;
    major?: string;
    level: string;
    totalCredits: number;
    courses: CourseSession[];
}

export default function AdminSchedulingPage() {
    const router = useRouter();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [level, setLevel] = useState<Level>('ALL');
    const [search, setSearch] = useState('');
    const [filterSemester, setFilterSemester] = useState('Fall 2025');
    const [previewBlock, setPreviewBlock] = useState<Block | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<CourseSession | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Add Block State (Modal)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addMode, setAddMode] = useState<'choice' | 'ai'>('choice');
    const [isParsing, setIsParsing] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const refreshBlocks = () => {
        setLoading(true);
        adminApi.getBlocks(level === 'ALL' ? undefined : level, filterSemester)
            .then(data => setBlocks(data as Block[]))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refreshBlocks();
    }, [level, filterSemester]);

    const filtered = blocks.filter(b => {
        const q = search.toLowerCase();
        return (
            b.blockId.toLowerCase().includes(q) ||
            b.courses.some(c => c.courseName.toLowerCase().includes(q)) ||
            (b.major ?? '').toLowerCase().includes(q)
        );
    });

    const handleFileUpload = async () => {
        if (!uploadFile) return;
        setIsParsing(true);
        try {
            const result = await adminApi.parseSchedulePdf(uploadFile);
            // Save to session storage to pass to the add page
            sessionStorage.setItem('temp_parsed_block', JSON.stringify(result));
            setIsAddModalOpen(false);
            router.push('/admin/scheduling/add?source=ai');
        } catch (e: any) {
            alert('Parsing failed: ' + e.message);
        } finally {
            setIsParsing(false);
        }
    };

    const handleDeleteBlock = async (block: Block) => {
        if (!confirm(`Are you sure you want to completely delete block ${block.blockId} for ${block.semester}?`)) return;
        try {
            await adminApi.deleteBlock(block.blockId, block.semester || '');
            setBlocks(blocks.filter(b => !(b.blockId === block.blockId && b.semester === block.semester)));
        } catch (e: any) {
            alert('Delete failed: ' + e.message);
        }
    };

    const handleEditBlock = (block: Block) => {
        sessionStorage.setItem('temp_parsed_block', JSON.stringify(block));
        router.push('/admin/scheduling/add?edit=true');
    };

    return (
        <div>
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="admin-page-header__title">Scheduling Blocks</h1>
                    <p className="admin-page-header__subtitle">
                        Browse all {blocks.length} scheduling blocks
                    </p>
                </div>
                <button 
                    className="admin-btn admin-btn--primary"
                    onClick={() => {
                        setAddMode('choice');
                        setIsAddModalOpen(true);
                    }}
                >
                    <Plus size={16} /> Add New Block
                </button>
            </div>

            {/* Toolbar */}
            <div className="admin-card__toolbar" style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: 'var(--adm-radius-lg)', marginBottom: '1.25rem', padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Level tabs */}
                    <div className="admin-toggle-group" style={{ margin: 0, height: '36px' }}>
                        {LEVELS.map(l => (
                            <button
                                key={l}
                                onClick={() => setLevel(l)}
                                className={`admin-toggle-group__btn ${level === l ? 'admin-toggle-group__btn--active' : ''}`}
                                style={{ height: '100%', display: 'flex', alignItems: 'center' }}
                            >
                                {l}
                            </button>
                        ))}
                    </div>

                    {/* Semester Select */}
                    <AdminSelect
                        value={filterSemester}
                        options={[
                            { value: 'ALL', label: 'All Semesters' },
                            { value: 'Fall 2025', label: 'Fall 2025' },
                            { value: 'Spring 2026', label: 'Spring 2026' }
                        ]}
                        onChange={setFilterSemester}
                        width="160px"
                    />
                </div>

                {/* Search */}
                <div className="admin-search" style={{ minWidth: '260px' }}>
                    <Search size={15} className="admin-search__icon" />
                    <input
                        className="admin-search__input"
                        placeholder="Search blocks or courses…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="admin-loading"> {error}</div>}

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="admin-card" style={{ padding: '1.25rem', height: '180px' }}>
                            <div className="admin-skeleton" style={{ height: 24, width: '40%', marginBottom: 12 }} />
                            <div className="flex gap-2 mb-4">
                                <div className="admin-skeleton" style={{ height: 16, width: 60 }} />
                                <div className="admin-skeleton" style={{ height: 16, width: 60 }} />
                            </div>
                            <div className="admin-skeleton" style={{ height: 42, width: '100%', borderRadius: 14, marginTop: 'auto' }} />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {filtered.map(block => {
                            const uniqueDays = Array.from(new Set(block.courses.map(c => c.day).filter(d => d && (d as any) !== 'TBA'))) as DayOfWeek[];
                            const totalCredits = block.totalCredits || (block.courses.length * 3);

                            return (
                                <div
                                    key={`${block.blockId}-${block.semester}`}
                                    className="admin-card"
                                    style={{ marginBottom: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%' }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                            <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--adm-text)', margin: 0 }}>
                                                {block.blockId}
                                            </h4>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <div style={{ position: 'relative' }}>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === block.blockId ? null : block.blockId); }} 
                                                        className="admin-btn admin-btn--icon admin-btn--ghost" 
                                                    >
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                    {activeDropdown === block.blockId && (
                                                        <>
                                                            <div 
                                                                className="fixed inset-0 z-40" 
                                                                onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }} 
                                                            />
                                                            <div 
                                                                style={{ 
                                                                    position: 'absolute', top: 'calc(100% + 4px)', right: 0, 
                                                                    background: 'white', border: '1px solid var(--adm-border)', 
                                                                    borderRadius: '8px', padding: '4px', zIndex: 50,
                                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                                    display: 'flex', flexDirection: 'column', minWidth: '120px'
                                                                }}
                                                            >
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handleEditBlock(block); setActiveDropdown(null); }} 
                                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--adm-text)', cursor: 'pointer', background: 'transparent', border: 'none' }}
                                                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--adm-surface-2)'}
                                                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                                >
                                                                    <Edit size={14} /> Edit
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block); setActiveDropdown(null); }} 
                                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '4px', fontSize: '0.85rem', color: '#ef4444', cursor: 'pointer', background: 'transparent', border: 'none' }}
                                                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--adm-surface-2)'}
                                                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                                >
                                                                    <Trash2 size={14} /> Delete
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <CreditCard size={13} /> {totalCredits} Credits
                                            </span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={13} /> {uniqueDays.length} Days
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1rem' }}>
                                            {uniqueDays.map(d => (
                                                <span key={d} style={{ padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, background: 'var(--adm-surface-2)', color: 'var(--adm-text-muted)', border: '1px solid var(--adm-border)' }}>
                                                    {d.slice(0, 3)}
                                                </span>
                                            ))}
                                        </div>

                                        <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)', margin: '0 0 1rem' }}>
                                            {block.major ? `${block.major} · ` : ''}{block.semester ?? 'No Semester'}
                                        </p>
                                    </div>

                                    <button
                                        className="admin-btn admin-btn--block-view admin-btn--sm"
                                        style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', gap: '0.5rem', borderRadius: '14px', height: '42px' }}
                                        onClick={() => setPreviewBlock(block)}
                                    >
                                        <Calendar size={15} strokeWidth={2} /> View Schedule
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Schedule Preview Modal */}
                    {previewBlock && (
                        <div
                            className="admin-modal-overlay"
                            style={{ zIndex: 1000 }}
                            onClick={(e) => { if (e.target === e.currentTarget) setPreviewBlock(null); }}
                        >
                            <div className="admin-modal" style={{ maxWidth: '1100px', width: '95%', height: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                                <div className="admin-modal__header" style={{ padding: '1.25rem 1.5rem', background: 'white' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>{previewBlock.blockId}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)', margin: 0 }}>Visual Schedule Timeline</p>
                                    </div>
                                    <button
                                        onClick={() => setPreviewBlock(null)}
                                        className="admin-btn admin-btn--ghost admin-btn--icon"
                                        style={{ borderRadius: '14px', width: '40px', height: '40px' }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="admin-modal__body" style={{ flex: 1, overflow: 'hidden', padding: '1.5rem', background: '#f1f5f9', position: 'relative' }}>
                                    <div style={{ height: '100%', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--adm-border)', position: 'relative' }}>
                                        <ScheduleGrid 
                                            courses={previewBlock.courses} 
                                            onCoursePress={(c) => setSelectedCourse(c)}
                                        />

                                        {/* Full-screen Overlay for Course Details (Student Style) */}
                                        {selectedCourse && (
                                            <div 
                                                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-[1.5px]"
                                                onClick={() => setSelectedCourse(null)}
                                            >
                                                <div 
                                                    className="max-w-md w-full"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <CourseDetailPanel 
                                                        course={selectedCourse} 
                                                        visible={!!selectedCourse} 
                                                        onClose={() => setSelectedCourse(null)} 
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {filtered.length === 0 && !loading && (
                <p style={{ color: 'var(--adm-text-muted)', textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem', width: '100%' }}>
                    No blocks match your search or filter criteria.
                </p>
            )}

            {/* Course Details Overlay */}
            {selectedCourse && (
                <CourseDetailPanel 
                    course={selectedCourse} 
                    visible={!!selectedCourse}
                    onClose={() => setSelectedCourse(null)} 
                />
            )}
            {/* Add Block Modal (Choice & AI Upload) */}
            {isAddModalOpen && (
                <div className="admin-modal-overlay" style={{ zIndex: 1200 }}>
                    <div className="admin-modal" style={{ maxWidth: '550px', width: '95%' }}>
                        <div className="admin-modal__header">
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                    {addMode === 'choice' ? 'Add New Scheduling Block' : 'AI Schedule Parsing'}
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>
                                    {addMode === 'choice' ? 'How would you like to create the new block?' : 'Upload a PDF to extract data automatically'}
                                </p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="admin-btn admin-btn--ghost admin-btn--icon">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="admin-modal__body" style={{ padding: '2rem' }}>
                            {addMode === 'choice' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <button 
                                        className="admin-card" 
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--adm-border)' }}
                                        onClick={() => setAddMode('ai')}
                                    >
                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(47, 128, 237, 0.1)', color: '#2F80ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileText size={28} />
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>AI Parser</h4>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>Upload PDF</p>
                                        </div>
                                    </button>

                                    <button 
                                        className="admin-card" 
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--adm-border)' }}
                                        onClick={() => router.push('/admin/scheduling/add')}
                                    >
                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Edit size={28} />
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Manual</h4>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>Type manually</p>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {addMode === 'ai' && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ border: '2px dashed var(--adm-border)', borderRadius: '20px', padding: '2.5rem', background: 'var(--adm-surface-2)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Upload size={40} style={{ color: 'var(--adm-text-muted)', marginBottom: '1rem' }} />
                                        <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>Upload PDF</h4>
                                        <input 
                                            type="file" 
                                            id="schedule-pdf-modal" 
                                            style={{ display: 'none' }} 
                                            accept=".pdf" 
                                            onChange={e => setUploadFile(e.target.files?.[0] || null)}
                                        />
                                        <label 
                                            htmlFor="schedule-pdf-modal" 
                                            className="admin-btn admin-btn--ghost"
                                            style={{ cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}
                                        >
                                            {uploadFile ? `File: ${uploadFile.name}` : 'Choose File'}
                                        </label>

                                        {uploadFile && (
                                            <button 
                                                className="admin-btn admin-btn--primary" 
                                                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                                                onClick={handleFileUpload}
                                                disabled={isParsing}
                                            >
                                                {isParsing ? 'Processing...' : 'Start Extraction'}
                                            </button>
                                        )}
                                    </div>
                                    <button className="admin-btn admin-btn--ghost" onClick={() => setAddMode('choice')}>Back</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
