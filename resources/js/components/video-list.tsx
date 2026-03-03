import { Video } from '@/types/video';
import { Link } from '@inertiajs/react';
import { Play, Clock, CheckCircle, AlertCircle } from 'lucide-react';

type VideoListProps = {
    videos: Video[];
};

const statusConfig = {
    pending: { icon: Clock, className: 'text-yellow-400' },
    processing: { icon: Clock, className: 'text-blue-400' },
    completed: { icon: CheckCircle, className: 'text-green-400' },
    failed: { icon: AlertCircle, className: 'text-red-400' },
};

export default function VideoList({ videos }: VideoListProps) {
    if (videos.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center overflow-y-auto p-10">
                <div className="max-w-sm text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#11181c] ring-1 ring-white/10">
                        <Play className="h-14 w-14 text-white/50" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
                        No videos yet
                    </h2>
                    <p className="text-[#92b7c9]">
                        Upload your media and write a script to get started.
                        Your generated video will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="flex flex-1 flex-col overflow-y-auto p-10">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-white">
                Your Videos
            </h2>

            <div className="space-y-4">
                {videos.map((video) => {
                    const config = statusConfig[video.status];
                    const StatusIcon = config.icon;

                    return (
                        <Link
                            key={video.id}
                            href={`/videos/${video.id}`}
                            className="group block rounded-lg border border-[#27272a] bg-[#18181b] p-4 transition hover:border-[#92b7c9]/30 hover:bg-[#27272a]"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-medium text-white group-hover:text-[#92b7c9]">
                                        {video.title || 'Untitled Video'}
                                    </h3>
                                    <p className="mt-1 text-sm text-[#92b7c9]">
                                        {video.script?.substring(0, 100)}
                                        {video.script && video.script.length > 100
                                            ? '...'
                                            : ''}
                                    </p>
                                </div>

                                <div className="ml-4 flex flex-col items-end space-y-2">
                                    <div
                                        className={`flex items-center space-x-2 ${config.className}`}
                                    >
                                        <StatusIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {video.status_label}
                                        </span>
                                    </div>
                                    <span className="text-xs text-[#92b7c9]/60">
                                        {new Date(
                                            video.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
