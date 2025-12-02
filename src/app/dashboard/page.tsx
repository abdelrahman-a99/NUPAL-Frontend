'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, parseJwt, removeToken } from '../../lib/auth';
 

 

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const user = parseJwt(token);
        if (!user) {
            removeToken();
            router.push('/login');
            return;
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-2">Empty state. Ready to build from scratch.</p>
        </div>
    );
}
