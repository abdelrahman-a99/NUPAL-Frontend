'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/services/adminApi';
import CourseMappingTable from '@/components/admin/CourseMappingTable';
import type { CourseMapping, CourseMappingForm, CourseMappingPayload } from '@/types/admin';

export default function AdminCourseMappingsPage() {
    const [mappings, setMappings] = useState<CourseMapping[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        setLoading(true);
        adminApi.getMappings()
            .then(setMappings)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleSave = async (form: CourseMappingForm, id?: string) => {
        const payload: CourseMappingPayload = {
            courseCode: form.courseCode,
            courseNames: form.courseNames.split(',').map(s => s.trim()).filter(Boolean),
            credits: form.credits,
            category: form.category,
        };

        if (id) {
            await adminApi.updateMapping(id, payload);
        } else {
            await adminApi.createMapping(payload);
        }
        load();
    };

    const handleDeleteAll = async () => {
        await adminApi.deleteAllMappings();
        load();
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-header__title">Courses</h1>
                <p className="admin-page-header__subtitle">
                    Manage system courses and their name variations across the Academic plan
                </p>
            </div>

            {error && <div className="admin-loading"> {error}</div>}

            {loading ? (
                <div className="admin-card">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="admin-skeleton" style={{ height: 48, margin: '4px 12px', borderRadius: 8 }} />
                    ))}
                </div>
            ) : (
                <CourseMappingTable
                    mappings={mappings}
                    onSave={handleSave}
                    onDeleteAll={handleDeleteAll}
                />
            )}
        </div>
    );
}
