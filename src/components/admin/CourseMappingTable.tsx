'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import AdminSelect from '@/components/admin/AdminSelect';
import type { CourseMapping, CourseMappingForm } from '@/types/admin';

interface CourseMappingTableProps {
    mappings: CourseMapping[];
    onSave: (data: CourseMappingForm, id?: string) => Promise<void>;
    onDeleteAll: () => Promise<void>;
}

const EMPTY_FORM: CourseMappingForm = {
    courseCode: '',
    courseNames: '',
    credits: 3,
    category: '',
};

export default function CourseMappingTable({ mappings, onSave, onDeleteAll }: CourseMappingTableProps) {
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [modal, setModal] = useState<{ open: boolean; editing?: CourseMapping }>({ open: false });
    const [form, setForm] = useState<CourseMappingForm>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setModal({ open: true });
    };

    const openEdit = (m: CourseMapping) => {
        setForm({
            courseCode: m.courseCode,
            courseNames: (m.courseNames || []).join(', '),
            credits: m.credits !== undefined ? m.credits : 3,
            category: m.category || '',
        });
        setModal({ open: true, editing: m });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(form, modal.editing?.id);
            setModal({ open: false });
        } finally {
            setSaving(false);
        }
    };

    const splitList = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);

    const filtered = mappings.filter(m => {
        const q = search.toLowerCase();
        const matchesSearch = (
            (m.courseCode || '').toLowerCase().includes(q) ||
            (m.courseNames || []).some(b => b.toLowerCase().includes(q)) ||
            (m.category || '').toLowerCase().includes(q)
        );
        const matchesCategory = filterCategory === '' || m.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <div className="admin-card">
                <div className="admin-card__toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
                        <div className="admin-search" style={{ minWidth: '300px' }}>
                            <input
                                className="admin-search__input"
                                placeholder="Search code or name…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <AdminSelect
                            value={filterCategory}
                            options={[
                                { value: '', label: 'All Categories' },
                                { value: 'General Education', label: 'General Education' },
                                { value: 'Math & Science', label: 'Math & Science' },
                                { value: 'ITCS Core', label: 'ITCS Core' },
                                { value: 'ITCSelectives', label: 'ITCSelectives' }
                            ]}
                            onChange={setFilterCategory}
                            width="200px"
                        />
                    </div>
                    <div className="admin-card__toolbar-actions">
                        <span className="admin-table__count">{filtered.length} courses</span>
                        <button onClick={openCreate} className="admin-btn admin-btn--primary admin-btn--sm">
                            <Plus size={14} /> Add Course
                        </button>
                    </div>
                </div>

                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="admin-table__th" style={{ width: '140px' }}>Course Code</th>
                                <th className="admin-table__th" style={{ width: '180px' }}>Category</th>
                                <th className="admin-table__th">Course Names (Aliases)</th>
                                <th className="admin-table__th" style={{ width: '100px' }}>Credits</th>
                                <th className="admin-table__th" style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="admin-table__empty">No courses found.</td></tr>
                            )}
                            {filtered.map(m => (
                                <tr key={m.id} className="admin-table__row">
                                    <td className="admin-table__td admin-table__td--mono">{m.courseCode}</td>
                                    <td className="admin-table__td">{m.category || '—'}</td>
                                    <td className="admin-table__td">
                                        <div className="admin-table__td--tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {(m.courseNames || []).map(n => <span key={n} className="admin-tag">{n}</span>)}
                                        </div>
                                    </td>
                                    <td className="admin-table__td">{m.credits !== undefined ? m.credits : '—'}</td>
                                    <td className="admin-table__td" style={{ textAlign: 'center' }}>
                                        <button onClick={() => openEdit(m)} className="admin-btn admin-btn--ghost admin-btn--icon">
                                            <Pencil size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {modal.open && (
                <div className="admin-modal-overlay" onClick={() => setModal({ open: false })}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h3>{modal.editing ? 'Edit Course' : 'New Course'}</h3>
                            <button onClick={() => setModal({ open: false })} className="admin-btn admin-btn--ghost admin-btn--icon">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="admin-modal__body">
                            {(['courseCode', 'courseNames', 'category', 'credits'] as const).map(field => (
                                <label key={field} className="admin-form__label">
                                    <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    {field === 'category' ? (
                                        <AdminSelect
                                            value={form[field]}
                                            options={[
                                                { value: '', label: 'Select a category' },
                                                { value: 'General Education', label: 'General Education' },
                                                { value: 'Math & Science', label: 'Math & Science' },
                                                { value: 'ITCS Core', label: 'ITCS Core' },
                                                { value: 'ITCSelectives', label: 'ITCSelectives' }
                                            ]}
                                            onChange={val => setForm(f => ({ ...f, [field]: val }))}
                                            width="100%"
                                        />
                                    ) : (
                                        <input
                                            type={field === 'credits' ? 'number' : 'text'}
                                            className="admin-input"
                                            placeholder={field === 'courseNames' ? 'Comma-separated aliases' : ''}
                                            value={form[field]}
                                            onChange={e => setForm(f => ({ ...f, [field]: field === 'credits' ? Number(e.target.value) : e.target.value }))}
                                        />
                                    )}
                                </label>
                            ))}
                        </div>
                        <div className="admin-modal__footer">
                            <button onClick={() => setModal({ open: false })} className="admin-btn admin-btn--ghost">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn--primary">
                                <Check size={15} /> {saving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
