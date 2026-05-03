'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Brain } from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import StudentProfile from '@/components/admin/StudentProfile';
import type { AdminStudentDetail, AdminRlRecommendation } from '@/types/admin';

export default function AdminStudentDetailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id') as string;

    if (!id) return <div className="admin-loading">No student ID provided.</div>;

    const [student, setStudent] = useState<AdminStudentDetail | null>(null);
    const [rec, setRec] = useState<AdminRlRecommendation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [triggering, setTriggering] = useState(false);

    useEffect(() => {
        Promise.all([
            adminApi.getStudent(id),
            adminApi.getStudentRecommendation(id).catch(() => null),
        ])
            .then(([s, r]) => { setStudent(s); setRec(r); })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    const handleTrigger = async () => {
        setTriggering(true);
        try {
            const result = await adminApi.triggerRl(id);
            alert(`✅ Job queued: ${result.jobId}`);
        } catch (e: any) {
            alert(`❌ ${e.message}`);
        } finally {
            setTriggering(false);
        }
    };

    if (loading) return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <div className="admin-skeleton" style={{ height: 36, width: 100 }} />
                <div className="admin-skeleton" style={{ height: 36, width: 200 }} />
            </div>
            <div className="admin-card" style={{ height: 300 }}>
                <div className="p-8 flex gap-6">
                    <div className="admin-skeleton" style={{ height: 80, width: 80, borderRadius: 20 }} />
                    <div className="flex-1 space-y-3">
                        <div className="admin-skeleton" style={{ height: 24, width: '40%' }} />
                        <div className="admin-skeleton" style={{ height: 16, width: '60%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
    if (error)   return <div className="admin-card p-12 text-center text-rose-500">❌ {error}</div>;
    if (!student) return <div className="admin-card p-12 text-center text-slate-500">Student not found.</div>;

    return (
        <div>
            {/* Back + Actions Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <button onClick={() => router.back()} className="admin-btn admin-btn--ghost admin-btn--sm">
                    <ArrowLeft size={15} /> Back
                </button>
                <button onClick={handleTrigger} disabled={triggering} className="admin-btn admin-btn--primary">
                    <Brain size={15} />
                    {triggering ? 'Queuing…' : 'Generate Recommendations'}
                </button>
            </div>

            {/* Student Profile */}
            <StudentProfile student={student} />

            {/* RL Recommendation Panel */}
            {rec && (
                <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                    <div className="admin-card__toolbar">
                        <h2 className="admin-card__title"><Brain size={16} /> Recommended Courses</h2>
                        <span className="admin-badge admin-badge--purple">Term {rec.termIndex}</span>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)', marginBottom: '0.75rem' }}>
                            Generated {new Date(rec.createdAt).toLocaleString()}
                            {rec.modelVersion && ` · Model: ${rec.modelVersion}`}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {rec.courses.map(c => <span key={c} className="admin-badge admin-badge--blue">{c}</span>)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
