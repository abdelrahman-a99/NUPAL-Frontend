'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import type { AdminStudentDetail } from '@/types/admin';

const GRADE_COLOR = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'admin-badge admin-badge--green';
    if (['B+', 'B', 'B-'].includes(grade)) return 'admin-badge admin-badge--blue';
    if (['C+', 'C', 'C-'].includes(grade)) return 'admin-badge admin-badge--amber';
    return 'admin-badge admin-badge--rose';
};

interface StudentProfileProps {
    student: AdminStudentDetail;
}

export default function StudentProfile({ student }: StudentProfileProps) {
    const [openSems, setOpenSems] = useState<Set<string>>(new Set([student.education.semesters[0]?.term]));

    const toggle = (term: string) =>
        setOpenSems(prev => {
            const next = new Set(prev);
            next.has(term) ? next.delete(term) : next.add(term);
            return next;
        });

    const lastSem = student.education.semesters.at(-1);

    return (
        <div className="admin-profile">
            {/* Header */}
            <div className="admin-profile__header">
                <div className="admin-profile__avatar">
                    {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="admin-profile__name">{student.name}</h2>
                    <p className="admin-profile__email">{student.email}</p>
                    <p className="admin-profile__id">ID: {student.id}</p>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="admin-profile__stats">
                {[
                    { label: 'Cumulative GPA', value: lastSem?.cumulativeGpa.toFixed(2) ?? '—' },
                    { label: 'Latest Sem GPA', value: lastSem?.semesterGpa.toFixed(2) ?? '—' },
                    { label: 'Total Credits', value: student.education.totalCredits },
                    { label: 'Semesters', value: student.education.numSemesters },
                    { label: 'Total Courses', value: student.education.semesters.reduce((a, s) => a + s.courses.length, 0) },
                ].map(stat => (
                    <div key={stat.label} className="admin-profile__stat">
                        <p className="admin-profile__stat-label">{stat.label}</p>
                        <p className="admin-profile__stat-value">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Semester Accordion */}
            <div className="admin-profile__semesters">
                <h3 className="admin-profile__section-title">
                    <BookOpen size={16} /> Academic History
                </h3>
                {[...student.education.semesters].reverse().map(sem => (
                    <div key={sem.term} className="admin-accordion">
                        <button
                            className="admin-accordion__trigger"
                            onClick={() => toggle(sem.term)}
                        >
                            <div className="admin-accordion__trigger-left">
                                <span className="admin-accordion__term">{sem.term}</span>
                                {sem.optional && <span className="admin-badge admin-badge--amber">Optional</span>}
                            </div>
                            <div className="admin-accordion__trigger-right">
                                <span className="admin-accordion__meta">GPA {sem.semesterGpa.toFixed(2)}</span>
                                <span className="admin-accordion__meta">{sem.semesterCredits} cr.</span>
                                <span className="admin-accordion__meta">{sem.courses.length} courses</span>
                                {openSems.has(sem.term) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                        </button>
                        {openSems.has(sem.term) && (
                            <div className="admin-accordion__body">
                                <table className="admin-table admin-table--compact">
                                    <thead>
                                        <tr>
                                            <th className="admin-table__th">Course ID</th>
                                            <th className="admin-table__th">Course Name</th>
                                            <th className="admin-table__th">Credits</th>
                                            <th className="admin-table__th">Grade</th>
                                            <th className="admin-table__th">GPA Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sem.courses.map(c => (
                                            <tr key={c.courseId} className="admin-table__row">
                                                <td className="admin-table__td admin-table__td--mono">{c.courseId}</td>
                                                <td className="admin-table__td">{c.courseName}</td>
                                                <td className="admin-table__td">{c.credit}</td>
                                                <td className="admin-table__td">
                                                    <span className={GRADE_COLOR(c.grade)}>{c.grade}</span>
                                                </td>
                                                <td className="admin-table__td">{c.gpa?.toFixed(2) ?? '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
