import type { Video } from '@/types/video';

import { DashboardTabs } from '@/components/dashboard-v2/DashboardTabs';
import { ActiveVideoCard } from '@/components/dashboard-v2/ActiveVideoCard';
import { CompletedVideoCard } from '@/components/dashboard-v2/CompletedVideoCard';
import { DraftVideoCard } from '@/components/dashboard-v2/DraftVideoCard';
import { DashboardV2Layout } from '@/layouts/dashboard-v2-layout';

type Props = {
    videos: Video[];
    currentStatus?: string;
};

export default function VideoCreatorV2({
    videos,
    currentStatus = 'all',
}: Props) {
    return (
        <DashboardV2Layout title="VidGen AI Dashboard - V2">
            <DashboardTabs currentStatus={currentStatus} />

            <div className="space-y-12">
                <h2 className="mb-6 text-lg font-bold text-slate-900">
                    All Videos
                </h2>

                {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-16">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100">
                            <svg
                                className="h-8 w-8 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-slate-900">
                            No projects yet
                        </h3>
                        <p className="mb-6 max-w-sm text-center text-sm text-slate-500">
                            Start creating your first video project to see it
                            appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {videos.map((video) => {
                            if (video.status === 'draft') {
                                return (
                                    <DraftVideoCard
                                        key={video.id}
                                        video={video}
                                    />
                                );
                            }

                            const isActive =
                                video.status === 'processing' ||
                                video.status === 'pending';
                            const CardComponent = isActive
                                ? ActiveVideoCard
                                : CompletedVideoCard;
                            return (
                                <CardComponent key={video.id} video={video} />
                            );
                        })}
                    </div>
                )}
            </div>

            {videos.length > 0 && (
                <div className="flex justify-center pt-4 pb-12">
                    <button className="rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95">
                        Load older projects
                    </button>
                </div>
            )}
        </DashboardV2Layout>
    );
}
