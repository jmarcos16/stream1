import { Head, router } from '@inertiajs/react';
import { VideoOff } from 'lucide-react';
import Pagination from '@/components/pagination';
import CreateVideoModal from '@/components/create-video-modal';
import VideoListItem from '@/components/video-list-item';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedResponse, Video } from '@/types/video';

type VideosIndexProps = {
    videos: PaginatedResponse<Video>;
    filters: {
        status: string;
    };
};

const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'drafts', label: 'Draft' },
] as const;

export default function VideosIndex({ videos, filters }: VideosIndexProps) {
    function handleStatusFilter(value: string) {
        const status = value === 'all' ? '' : value;
        router.get('/videos', status ? { status } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <AppLayout>
            <Head title="Videos" />

            <div className="mx-auto w-full max-w-5xl px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Videos</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {videos.total} {videos.total === 1 ? 'video' : 'videos'}
                        </p>
                    </div>
                    <CreateVideoModal />
                </div>

                <div className="mb-6">
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={handleStatusFilter}
                    >
                        <SelectTrigger className="w-44 border-slate-800 bg-slate-900/60 text-slate-300">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-900">
                            {STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {videos.data.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {videos.data.map((video) => (
                            <VideoListItem key={video.id} video={video} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 py-20">
                        <VideoOff className="mb-4 h-12 w-12 text-slate-700" />
                        <h3 className="text-lg font-semibold text-slate-400">
                            No videos found
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                            {filters.status
                                ? 'Try changing the status filter.'
                                : 'Create your first video to get started.'}
                        </p>
                        {!filters.status && (
                            <div className="mt-6">
                                <CreateVideoModal />
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8">
                    <Pagination
                        links={videos.links}
                        currentPage={videos.current_page}
                        lastPage={videos.last_page}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
