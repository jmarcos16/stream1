import type { Video } from '@/types/video';

import { DashboardTabs } from '@/components/dashboard-v2/DashboardTabs';
import { ActiveVideoCard } from '@/components/dashboard-v2/ActiveVideoCard';
import { CompletedVideoCard } from '@/components/dashboard-v2/CompletedVideoCard';
import { DashboardV2Layout } from '@/layouts/dashboard-v2-layout';

type Props = {
    videos: Video[];
    currentStatus?: string;
};

export default function VideoCreatorV2({ videos, currentStatus = 'all' }: Props) {
    return (
        <DashboardV2Layout title="VidGen AI Dashboard - V2">
            <DashboardTabs currentStatus={currentStatus} />

            <div className="space-y-12">
                <h2 className="text-lg font-bold text-slate-900 mb-6">All Videos</h2>
                
                {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No projects yet</h3>
                        <p className="text-sm text-slate-500 text-center max-w-sm mb-6">Start creating your first video project to see it appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {videos.map((video) => {
                            const isActive = video.status === 'processing' || video.status === 'pending';
                            const CardComponent = isActive ? ActiveVideoCard : CompletedVideoCard;
                            return <CardComponent key={video.id} video={video} />;
                        })}
                    </div>
                )}
            </div>

            {videos.length > 0 && (
                <div className="flex justify-center pt-4 pb-12">
                    <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm">
                        Load older projects
                    </button>
                </div>
            )}
        </DashboardV2Layout>
    );
}
