import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import { DashboardHeader } from '@/components/dashboard-v2/DashboardHeader';
import { DashboardFooter } from '@/components/dashboard-v2/DashboardFooter';

type Props = {
    children: ReactNode;
    title?: string;
};

export function DashboardV2Layout({ children, title }: Props) {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-white font-sans text-slate-900">
            {title && <Head title={title} />}
            
            <DashboardHeader />

            <main className="flex-1 px-6 lg:px-20 py-10 bg-[#f9fafb]">
                <div className="max-w-6xl mx-auto flex flex-col gap-10">
                    {children}
                </div>
            </main>

            <DashboardFooter />
        </div>
    );
}
