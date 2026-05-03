'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getUserRole } from '@/lib/auth';
import '../globals.css';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const role = getUserRole();

        if (role !== 'admin') {
            // Not logged in or not an admin — send to login
            router.replace('/login');
        }
    }, [router]);

    // Prevent hydration errors by returning null until mounted on client
    if (!mounted) {
        return null;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-layout__main">
                {children}
            </main>
        </div>
    );
}
