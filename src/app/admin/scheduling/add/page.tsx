'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Plus, Upload, FileText, Edit, X } from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import AdminSelect from '@/components/admin/AdminSelect';
import { CourseMapping } from '@/types/admin';
import ScheduleGrid from '@/components/scheduling/ScheduleGrid';
import CourseDetailPanel from '@/components/scheduling/CourseDetailModal';
import { CourseSession, DayOfWeek } from '@/types/scheduling';

interface Block {
    blockId: string;
    semester?: string;
    major?: string;
    level: string;
    totalCredits: number;
    courses: CourseSession[];
}

export default function AddSchedulingBlockPage() {
    const router = useRouter();
    const [isParsing, setIsParsing] = useState(false);
    
    // Manual Entry State
    const [manualBlock, setManualBlock] = useState<Partial<Block>>({
        blockId: '',
        semester: 'Fall 2025',
        level: 'FR',
        major: '',
        courses: []
    });

    const [newCourse, setNewCourse] = useState<Partial<CourseSession>>({
        courseName: '',
        instructor: '',
        day: 'Monday',
        start: '08:30',
        end: '10:00',
        section: '01A',
        room: '',
        subtype: 'Lecture'
    });

    // Course Search / Autocomplete Logic
    const [allCourses, setAllCourses] = useState<CourseMapping[]>([]);
    const [suggestions, setSuggestions] = useState<CourseMapping[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseSession | null>(null);
    const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(null);
    
    const [isEditing, setIsEditing] = useState(false);
    const [initialSemester, setInitialSemester] = useState<string | null>(null);

    useEffect(() => {
        // Check if editing
        if (typeof window !== 'undefined') {
            setIsEditing(new URLSearchParams(window.location.search).get('edit') === 'true');
        }

        // Fetch existing mappings to use for autocomplete
        adminApi.getMappings().then(data => setAllCourses(data)).catch(err => console.error(err));
        
        // Check if we have parsed data from AI Modal
        const temp = sessionStorage.getItem('temp_parsed_block');
        if (temp) {
            try {
                const parsed = JSON.parse(temp);
                setManualBlock(parsed);
                setInitialSemester(parsed.semester || null);
                // Clear after picking up
                sessionStorage.removeItem('temp_parsed_block');
            } catch (e) {
                console.error("Failed to load parsed block", e);
            }
        }
    }, []);

    const handleCourseNameChange = (val: string) => {
        setNewCourse({ ...newCourse, courseName: val });
        if (val.length > 1) {
            const filtered = allCourses.filter(c => 
                (c.courseCode?.toLowerCase() || '').includes(val.toLowerCase()) || 
                c.courseNames?.some(name => name.toLowerCase().includes(val.toLowerCase()))
            ).slice(0, 20); // Allow more for scrolling
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSaveBlock = async () => {
        if (!manualBlock.blockId || (manualBlock.courses?.length || 0) === 0) {
            alert('Please provide a Block ID and add at least one course.');
            return;
        }

        try {
            if (isEditing) {
                await adminApi.updateBlock(manualBlock.blockId, initialSemester || manualBlock.semester || '', manualBlock);
                alert('Block updated successfully!');
            } else {
                await adminApi.createBlock(manualBlock);
                alert('Block created successfully!');
            }
            router.push('/admin/scheduling');
        } catch (e: any) {
            alert('Save failed: ' + e.message);
        }
    };

    return (
        <div className="admin-container" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header - Smaller & Simpler */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                    onClick={() => router.back()} 
                    className="admin-btn admin-btn--ghost"
                    style={{ padding: '0.5rem', borderRadius: '12px' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--adm-text)' }}>
                        {manualBlock.blockId ? `Review Block: ${manualBlock.blockId}` : 'Add Scheduling Block'}
                    </h1>
                    <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem' }}>
                        {manualBlock.courses && manualBlock.courses.length > 0 
                            ? 'Verify course details before final save.'
                            : 'Enter block identity and add courses to the schedule.'}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {/* Inputs Area - More Horizontal Flow */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Block Identity - Single Row */}
                    <div>
                        <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem', color: 'var(--adm-text)' }}>Block Identity</h4>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                            <div className="admin-form-group" style={{ flex: 2, minWidth: '200px' }}>
                                <label className="admin-form__label" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Block ID</label>
                                <input className="admin-input" style={{ height: '40px', opacity: isEditing ? 0.7 : 1 }} disabled={isEditing} placeholder="e.g. CS-JR-1A" value={manualBlock.blockId} onChange={e => setManualBlock({...manualBlock, blockId: e.target.value})} />
                            </div>
                            <div className="admin-form-group" style={{ flex: 1, minWidth: '150px' }}>
                                <label className="admin-form__label" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Semester</label>
                                <AdminSelect
                                    value={manualBlock.semester || ''}
                                    options={[
                                        { value: 'Fall 2025', label: 'Fall 2025' },
                                        { value: 'Spring 2026', label: 'Spring 2026' }
                                    ]}
                                    onChange={(val) => setManualBlock({...manualBlock, semester: val})}
                                    width="100%"
                                />
                            </div>
                            <div className="admin-form-group" style={{ flex: 1, minWidth: '100px' }}>
                                <label className="admin-form__label" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Level</label>
                                <AdminSelect
                                    value={manualBlock.level || ''}
                                    options={[
                                        { value: 'FR', label: 'FR' },
                                        { value: 'SO', label: 'SO' },
                                        { value: 'JR', label: 'JR' },
                                        { value: 'SR', label: 'SR' }
                                    ]}
                                    onChange={(val) => setManualBlock({...manualBlock, level: val})}
                                    width="100%"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add Course Section - Organized Rows */}
                    <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1.5rem' }}>
                        <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem', color: 'var(--adm-text)' }}>Course Details</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                                <div style={{ flex: 2, position: 'relative' }}>
                                    <input 
                                        className="admin-input" 
                                        style={{ width: '100%', height: '40px' }} 
                                        placeholder="Course Name or Code" 
                                        value={newCourse.courseName} 
                                        onChange={e => handleCourseNameChange(e.target.value)}
                                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    />
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div style={{ 
                                            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, 
                                            background: 'white', border: '1px solid var(--adm-border)', 
                                            borderRadius: '12px', marginTop: '4px', overflowY: 'auto', 
                                            maxHeight: '220px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                                        }}>
                                            {suggestions.map(s => (
                                                <button 
                                                    key={s.id} 
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        const primaryName = s.courseNames?.[0] || 'Unknown Course';
                                                        setNewCourse({ ...newCourse, courseName: `${s.courseCode} - ${primaryName}` });
                                                        setShowSuggestions(false);
                                                    }}
                                                    style={{ 
                                                        width: '100%', padding: '0.75rem 1rem', textAlign: 'left', 
                                                        border: 'none', background: 'none', cursor: 'pointer', 
                                                        display: 'flex', flexDirection: 'column', gap: '2px',
                                                        borderBottom: '1px solid var(--adm-surface-2)'
                                                    }}
                                                    className="suggestion-item"
                                                >
                                                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.courseCode}</span>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>{s.courseNames?.[0]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input className="admin-input" style={{ flex: 1, height: '40px' }} placeholder="Instructor" value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <AdminSelect
                                    value={newCourse.day || ''}
                                    options={[
                                        { value: 'Sunday', label: 'Sunday' },
                                        { value: 'Monday', label: 'Monday' },
                                        { value: 'Tuesday', label: 'Tuesday' },
                                        { value: 'Wednesday', label: 'Wednesday' },
                                        { value: 'Thursday', label: 'Thursday' },
                                        { value: 'Saturday', label: 'Saturday' }
                                    ]}
                                    onChange={(val) => setNewCourse({...newCourse, day: val as DayOfWeek})}
                                    width="140px"
                                />
                                <input className="admin-input" style={{ flex: 1, height: '40px' }} type="time" value={newCourse.start} onChange={e => setNewCourse({...newCourse, start: e.target.value})} />
                                <input className="admin-input" style={{ flex: 1, height: '40px' }} type="time" value={newCourse.end} onChange={e => setNewCourse({...newCourse, end: e.target.value})} />
                                <input className="admin-input" style={{ flex: 1, height: '40px' }} placeholder="Section" value={newCourse.section} onChange={e => setNewCourse({...newCourse, section: e.target.value})} />
                                <input className="admin-input" style={{ flex: 1, height: '40px' }} placeholder="Room" value={newCourse.room} onChange={e => setNewCourse({...newCourse, room: e.target.value})} />
                                <AdminSelect
                                    value={newCourse.subtype || ''}
                                    options={[
                                        { value: 'Lecture', label: 'Lecture' },
                                        { value: 'Tutorial', label: 'Tutorial' },
                                        { value: 'Lab', label: 'Lab' }
                                    ]}
                                    onChange={(val) => setNewCourse({...newCourse, subtype: val})}
                                    width="140px"
                                />
                                <button 
                                    className="admin-btn admin-btn--primary" 
                                    style={{ height: '40px', padding: '0 1.5rem', justifyContent: 'center' }}
                                    onClick={() => {
                                        // 1. Validate empty fields
                                        if (!newCourse.courseName || !newCourse.instructor || !newCourse.day || !newCourse.start || !newCourse.end || !newCourse.section || !newCourse.room || !newCourse.subtype) {
                                            alert("Please fill in all course details before adding.");
                                            return;
                                        }

                                        // 2. Validate that the course exists in allCourses (mappings)
                                        const val = newCourse.courseName.toLowerCase();
                                        const exists = allCourses.some(c => 
                                            val.includes(c.courseCode.toLowerCase()) || 
                                            c.courseNames?.some(name => val.includes(name.toLowerCase()))
                                        );

                                        if (!exists) {
                                            alert("This course is not in the system mappings. Please select a valid course from the suggestions.");
                                            return;
                                        }

                                        // 3. Check for exact duplicates in the current block
                                        const isDuplicate = manualBlock.courses?.some((c, idx) => {
                                            if (editingCourseIndex === idx) return false; // Skip the one we are currently editing
                                            return c.courseName === newCourse.courseName &&
                                                   c.day === newCourse.day &&
                                                   c.start === newCourse.start &&
                                                   c.end === newCourse.end &&
                                                   c.section === newCourse.section;
                                        });

                                        if (isDuplicate) {
                                            alert("This exact course section is already added to the schedule at this time.");
                                            return;
                                        }

                                        if (editingCourseIndex !== null) {
                                            const updatedCourses = [...(manualBlock.courses || [])];
                                            updatedCourses[editingCourseIndex] = { ...newCourse as CourseSession, courseId: newCourse.courseName.replace(/\s+/g, '_') };
                                            setManualBlock({
                                                ...manualBlock,
                                                courses: updatedCourses
                                            });
                                            setEditingCourseIndex(null);
                                        } else {
                                            setManualBlock({
                                                ...manualBlock,
                                                courses: [...(manualBlock.courses || []), { ...newCourse as CourseSession, courseId: newCourse.courseName.replace(/\s+/g, '_') }]
                                            });
                                        }
                                        
                                        // Reset newCourse form
                                        setNewCourse({
                                            courseName: '',
                                            instructor: '',
                                            day: 'Monday',
                                            start: '08:30',
                                            end: '10:00',
                                            section: '01A',
                                            room: '',
                                            subtype: 'Lecture'
                                        });
                                    }}
                                >
                                    {editingCourseIndex !== null ? (
                                        <><Check size={18} /> Update Course</>
                                    ) : (
                                        <><Plus size={18} /> Add Course</>
                                    )}
                                </button>
                                {editingCourseIndex !== null && (
                                    <button 
                                        className="admin-btn admin-btn--ghost" 
                                        style={{ height: '40px', padding: '0 1rem', color: '#ef4444' }}
                                        onClick={() => {
                                            setEditingCourseIndex(null);
                                            setNewCourse({
                                                courseName: '',
                                                instructor: '',
                                                day: 'Monday',
                                                start: '08:30',
                                                end: '10:00',
                                                section: '01A',
                                                room: '',
                                                subtype: 'Lecture'
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Width Preview */}
                <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Schedule Preview</h3>
                        <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.8rem' }}>
                            {manualBlock.courses?.length || 0} courses added
                        </div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--adm-border)', overflow: 'hidden', position: 'relative', height: '600px' }}>
                        <ScheduleGrid 
                            courses={manualBlock.courses || []} 
                            onCoursePress={(c) => setSelectedCourse(c)}
                            onCourseRemove={(c) => {
                                setManualBlock({
                                    ...manualBlock,
                                    courses: manualBlock.courses?.filter(x => x !== c)
                                });
                            }}
                            onCourseEdit={(c) => {
                                // 1. Populate the form
                                setNewCourse(c);
                                // 2. Find the index and set it
                                const idx = manualBlock.courses?.findIndex(x => x === c) ?? -1;
                                if (idx !== -1) setEditingCourseIndex(idx);
                                // 3. Scroll to top
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                        Tip: Hover over any course to see the edit and delete icons in the top right, or click the card to view details.
                    </p>
                </div>

                {/* Actions Row at the very bottom */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--adm-border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                    <button className="admin-btn admin-btn--ghost" onClick={() => router.push('/admin/scheduling')}>Discard Changes</button>
                    <button className="admin-btn admin-btn--primary" style={{ background: '#10B981', padding: '0.75rem 2rem' }} onClick={handleSaveBlock}>
                        <Check size={18} /> Save Final Block
                    </button>
                </div>
            </div>

            {/* Course Details Overlay */}
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
    );
}
