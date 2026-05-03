'use client';

import { useState } from 'react';
import { RefreshCw, Zap, Users } from 'lucide-react';

interface RlEngineControlsProps {
    onSyncAll: (isSimulation: boolean) => Promise<void>;
    onTriggerSingle: (studentId: string, isSimulation: boolean) => Promise<void>;
    syncing: boolean;
    triggerResult?: { totalStudents: number; triggeredJobs: number } | null;
}

export default function RlEngineControls({
    onSyncAll,
    onTriggerSingle,
    syncing,
    triggerResult,
}: RlEngineControlsProps) {
    const [studentId, setStudentId] = useState('');
    const [isSimulation, setIsSimulation] = useState(false);
    const [singleTriggering, setSingleTriggering] = useState(false);
    const [singleResult, setSingleResult] = useState<string | null>(null);

    const handleSingle = async () => {
        if (!studentId.trim()) return;
        setSingleTriggering(true);
        setSingleResult(null);
        try {
            await onTriggerSingle(studentId.trim(), isSimulation);
            setSingleResult(' Job queued successfully');
        } catch (e: any) {
            setSingleResult(` ${e.message}`);
        } finally {
            setSingleTriggering(false);
        }
    };

    return (
        <div className="admin-card">
            <div className="admin-card__toolbar">
                <h2 className="admin-card__title">Engine Controls</h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '1.5rem' }}>
                {/* Simulation Toggle */}
                <div style={{ flex: '1 1 200px' }}>
                    <h3 className="admin-card__title" style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Run Mode</h3>
                    <div className="admin-toggle-group" style={{ marginTop: 0 }}>
                        <button
                            className={`admin-toggle-group__btn ${!isSimulation ? 'admin-toggle-group__btn--active' : ''}`}
                            onClick={() => setIsSimulation(false)}
                        >
                            Production
                        </button>
                        <button
                            className={`admin-toggle-group__btn ${isSimulation ? 'admin-toggle-group__btn--active' : ''}`}
                            onClick={() => setIsSimulation(true)}
                        >
                            <Zap size={13} /> Simulation
                        </button>
                    </div>
                    {isSimulation && (
                        <p className="admin-controls__hint">
                            Simulation mode trains on data minus the last 2 semesters to test recommendation quality.
                        </p>
                    )}
                </div>

                {/* Sync All */}
                <div style={{ flex: '1 1 250px' }}>
                    <h3 className="admin-card__title" style={{ fontSize: '0.9rem' }}>
                        <Users size={16} /> Sync All Students
                    </h3>
                    <p className="admin-card__desc" style={{ marginBottom: '0.75rem' }}>
                        Triggers recompute for every student whose academic data has changed since their last job.
                    </p>
                    <button
                        onClick={() => onSyncAll(isSimulation)}
                        disabled={syncing}
                        className="admin-btn admin-btn--primary"
                    >
                        <RefreshCw size={15} className={syncing ? 'admin-spin' : ''} />
                        {syncing ? 'Syncing…' : 'Sync All Students'}
                    </button>
                    {triggerResult && (
                        <div className="admin-controls__result">
                            <span className="admin-badge admin-badge--green">Done</span>
                            {triggerResult.triggeredJobs} / {triggerResult.totalStudents} students queued
                        </div>
                    )}
                </div>

                {/* Trigger Single */}
                <div style={{ flex: '1 1 250px' }}>
                    <h3 className="admin-card__title" style={{ fontSize: '0.9rem' }}>Trigger Single Student</h3>
                    <p className="admin-card__desc" style={{ marginBottom: '0.75rem' }}>Manually run for a specific student by ID or email.</p>
                    <div className="admin-controls__input-row">
                        <input
                            className="admin-input"
                            placeholder="Student ID or email"
                            value={studentId}
                            onChange={e => setStudentId(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSingle()}
                        />
                        <button
                            onClick={handleSingle}
                            disabled={singleTriggering || !studentId.trim()}
                            className="admin-btn admin-btn--primary"
                        >
                            {singleTriggering ? 'Queuing…' : 'Trigger'}
                        </button>
                    </div>
                    {singleResult && <p className="admin-controls__result">{singleResult}</p>}
                </div>
            </div>
        </div>
    );
}
