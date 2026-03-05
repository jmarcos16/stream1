import { Edit, Play } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { Video } from '@/types/video';
import { edit } from '@/routes/video-creator/v2';

type Props = {
    video: Video;
};

export function DraftVideoCard({ video }: Props) {
    const canGenerate = Boolean(video.script);

    return (
        <div className="group flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-yellow-500/20 hover:bg-slate-50/50">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 shadow-sm">
                <img
                    src={`https://picsum.photos/200/200?random=${video.id}`}
                    alt={video.title || `Video ${video.id}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <h4 className="truncate text-base font-bold text-slate-900">
                            {video.title || `Untitled Project #${video.id}`}
                        </h4>
                        <div className="mt-1.5 flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">
                                {new Date(
                                    video.created_at,
                                ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full border border-yellow-100/50 bg-yellow-50 px-2.5 py-1 text-[11px] font-bold text-yellow-600">
                                <Edit className="size-3.5" />
                                {video.status_label}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={edit({ video: video.id })}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-white hover:shadow-sm"
                        >
                            <Edit className="size-4 text-slate-500" />
                            Edit
                        </Link>
                        {canGenerate && (
                            <button className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/10 transition-all hover:bg-indigo-600">
                                <Play className="size-4" />
                                Generate Video
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
