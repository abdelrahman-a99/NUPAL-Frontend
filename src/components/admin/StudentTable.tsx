'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronUp, ChevronDown, Brain, Eye } from 'lucide-react';
import type { AdminStudentSummary } from '@/types/admin';

interface StudentTableProps {
    students: AdminStudentSummary[];
}

type SortKey = keyof Pick<AdminStudentSummary, 'name' | 'cumulativeGpa' | 'totalCredits' | 'numSemesters'>;

const GPA_COLOR = (gpa: number) => {
    if (gpa >= 3.7) return 'admin-badge admin-badge--green';
    if (gpa >= 3.0) return 'admin-badge admin-badge--blue';
    if (gpa >= 2.0) return 'admin-badge admin-badge--amber';
    return 'admin-badge admin-badge--rose';
};

export default function StudentTable({ students }: StudentTableProps) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const filtered = students
        .filter(s => {
            const q = search.toLowerCase();
            return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
        })
        .sort((a, b) => {
            const va = a[sortKey];
            const vb = b[sortKey];
            const cmp = typeof va === 'string'
                ? va.localeCompare(vb as string)
                : (va as number) - (vb as number);
            return sortDir === 'asc' ? cmp : -cmp;
        });

    const SortIcon = ({ col }: { col: SortKey }) =>
        sortKey === col
            ? sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
            : <ChevronDown size={13} className="admin-table__sort-icon--muted" />;

    return (
        <div className="admin-card">
            {/* Search */}
            <div className="admin-card__toolbar">
                <div className="admin-search">
                    <Search size={15} className="admin-search__icon" />
                    <input
                        className="admin-search__input"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <span className="admin-table__count">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Table */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')} className="admin-table__th admin-table__th--sortable">
                                Name <SortIcon col="name" />
                            </th>
                            <th className="admin-table__th">Email</th>
                            <th onClick={() => handleSort('cumulativeGpa')} className="admin-table__th admin-table__th--sortable">
                                GPA <SortIcon col="cumulativeGpa" />
                            </th>
                            <th onClick={() => handleSort('totalCredits')} className="admin-table__th admin-table__th--sortable">
                                Credits <SortIcon col="totalCredits" />
                            </th>
                            <th onClick={() => handleSort('numSemesters')} className="admin-table__th admin-table__th--sortable">
                                Semesters <SortIcon col="numSemesters" />
                            </th>
                            <th className="admin-table__th">Latest Term</th>
                            <th className="admin-table__th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="admin-table__empty">No students found.</td>
                            </tr>
                        )}
                        {filtered.map(s => (
                            <tr key={s.id} className="admin-table__row">
                                <td className="admin-table__td admin-table__td--name">{s.name}</td>
                                <td className="admin-table__td admin-table__td--muted">{s.email}</td>
                                <td className="admin-table__td">
                                    <span className={GPA_COLOR(s.cumulativeGpa)}>
                                        {s.cumulativeGpa.toFixed(2)}
                                    </span>
                                </td>
                                <td className="admin-table__td">{s.totalCredits}</td>
                                <td className="admin-table__td">{s.numSemesters}</td>
                                <td className="admin-table__td admin-table__td--muted">{s.latestTerm}</td>
                                <td className="admin-table__td">
                                    <div className="admin-table__actions">
                                        <Link href={`/admin/students/detail?id=${s.id}`} className="admin-btn admin-btn--ghost admin-btn--sm">
                                            <Eye size={14} /> View
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
