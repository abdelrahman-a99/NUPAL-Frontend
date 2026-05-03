'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/services/adminApi';
import StudentTable from '@/components/admin/StudentTable';
import type { AdminStudentSummary } from '@/types/admin';

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<AdminStudentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        setLoading(true);
        adminApi.getStudents()
            .then(setStudents)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);


    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-header__title">Student Management</h1>
                <p className="admin-page-header__subtitle">
                    {students.length} student{students.length !== 1 ? 's' : ''} registered in the platform
                </p>
            </div>

            {error && <div className="admin-loading">❌ {error}</div>}

            {loading ? (
                <div className="admin-card">
                    <div className="admin-card__toolbar">
                        <div className="admin-skeleton" style={{ height: 36, width: 240 }} />
                    </div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="admin-skeleton" style={{ height: 48, margin: '4px 12px', borderRadius: 8 }} />
                    ))}
                </div>
            ) : (
                <StudentTable students={students} />
            )}
        </div>
    );
}
