import { useCallback, useState } from 'react';
import { router } from '@inertiajs/react';
import { Link, Plus } from 'lucide-react';
import { v2 } from '@/routes/video-creator';
import { store } from '@/routes/video-creator/v2/draft';

type TabType = 'all' | 'processing' | 'completed' | 'drafts';

type Props = {
    currentStatus?: string;
};

export function DashboardTabs({ currentStatus = 'all' }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>(
        (currentStatus as TabType) || 'all',
    );

    const tabs: { id: TabType; label: string }[] = [
        { id: 'all', label: 'All Videos' },
        { id: 'processing', label: 'Processing' },
        { id: 'completed', label: 'Completed' },
        { id: 'drafts', label: 'Drafts' },
    ];

    const handleTabChange = (tabId: TabType) => {
        setActiveTab(tabId);

        router.visit(v2(), {
            method: 'get',
            data: { status: tabId },
            preserveState: true,
        });
    };

    const handleNewProject = () => {
        router.post(store());
    };

    return (
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 sm:flex-row sm:items-center">
            <nav className="flex hide-scrollbar gap-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`relative pb-4 text-sm transition-colors ${
                            activeTab === tab.id
                                ? 'font-semibold text-indigo-500'
                                : 'font-medium text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-indigo-500"></span>
                        )}
                    </button>
                ))}
            </nav>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleNewProject}
                    className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
                >
                    <Plus className="size-5" />
                    New Project
                </button>
            </div>
        </div>
    );
}
