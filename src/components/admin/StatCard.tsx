'use client';

import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ReactNode;
    accent?: 'blue' | 'green' | 'amber' | 'purple' | 'rose';
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps['accent']>, string> = {
    blue:   'admin-stat-card--blue',
    green:  'admin-stat-card--green',
    amber:  'admin-stat-card--amber',
    purple: 'admin-stat-card--purple',
    rose:   'admin-stat-card--rose',
};

export default function StatCard({ title, value, subtitle, icon, accent = 'blue' }: StatCardProps) {
    return (
        <div className={`admin-stat-card ${ACCENT_CLASSES[accent]}`}>
            <div className="admin-stat-card__icon">{icon}</div>
            <div className="admin-stat-card__body">
                <p className="admin-stat-card__title">{title}</p>
                <p className="admin-stat-card__value">{value}</p>
                {subtitle && <p className="admin-stat-card__subtitle">{subtitle}</p>}
            </div>
        </div>
    );
}
