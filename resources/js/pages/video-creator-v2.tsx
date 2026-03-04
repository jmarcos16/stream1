import { Head } from '@inertiajs/react';
import type { Video } from '@/types/video';

import { DashboardTabs } from '@/components/dashboard-v2/DashboardTabs';
import { ActiveVideoCard } from '@/components/dashboard-v2/ActiveVideoCard';
import { CompletedVideoCard } from '@/components/dashboard-v2/CompletedVideoCard';
import { DashboardV2Layout } from '@/layouts/dashboard-v2-layout';

type Props = {
    videos: Video[];
};

export default function VideoCreatorV2({ videos }: Props) {
    const todayVideos = videos.filter(v => v.status === 'processing' || v.status === 'pending');
    const yesterdayVideos = videos.filter(v => v.status === 'completed').slice(0, 1);
    const lastWeekVideos = videos.filter(v => v.status === 'completed').slice(1);

    return (
        <DashboardV2Layout title="VidGen AI Dashboard - V2">
            <DashboardTabs />

            <div className="space-y-12">
                {/* SectionToday */}
                <section data-purpose="today-projects">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Active / Processing</h2>
                        <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">{todayVideos.length} Active</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {todayVideos.length === 0 && (
                            <div className="text-sm text-slate-500 italic p-4 border border-slate-200 border-dashed rounded-xl bg-white">No active processing tasks at the moment.</div>
                        )}
                        {todayVideos.map((video) => (
                            <ActiveVideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </section>

                {/* SectionYesterday */}
                <section data-purpose="yesterday-projects">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Completions</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {yesterdayVideos.length === 0 && (
                            <div className="text-sm text-slate-500 italic p-4 border border-slate-200 border-dashed rounded-xl bg-white">No recent completion jobs found.</div>
                        )}
                        {yesterdayVideos.map(video => (
                            <CompletedVideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </section>

                {/* SectionLastWeek */}
                {lastWeekVideos.length > 0 && (
                    <section data-purpose="last-week-projects">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Archive</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {lastWeekVideos.map(video => (
                                <CompletedVideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center pt-4 pb-12">
                <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm">
                    Load older projects
                </button>
            </div>
        </DashboardV2Layout>
    );
}
