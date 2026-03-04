import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { v2Wizard } from '@/actions/App/Http/Controllers/VideoCreatorController';

export function DashboardTabs() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200">
            <nav className="flex gap-8 overflow-x-auto hide-scrollbar">
                <button className="relative pb-4 text-sm font-semibold text-indigo-500">
                    All Videos
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></span>
                </button>
                <button className="pb-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Processing</button>
                <button className="pb-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Completed</button>
                <button className="pb-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Drafts</button>
            </nav>
            <div className="flex items-center gap-2">
                <Link href="/video-creator" className="mb-3 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95 border border-slate-200">
                    <Plus className="size-4" />
                    Classic UX
                </Link>
                <Link href={v2Wizard()} className="mb-3 flex items-center justify-center gap-2 bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
                    <Plus className="size-5" />
                    New Project
                </Link>
            </div>
        </div>
    );
}
