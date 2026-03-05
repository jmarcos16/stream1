import { Play, CheckCircle2, Eye, Download } from 'lucide-react';
import type { Video } from '@/types/video';

type Props = {
    video: Video;
};

export function CompletedVideoCard({ video }: Props) {
    const hasThumbnail = video.video_path;

    return (
        <div className="group flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-500/20 hover:bg-slate-50/50">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-slate-100 shadow-sm">
                {hasThumbnail ? (
                    <>
                        <video
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={video?.video_path}
                        ></video>
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="rounded-full bg-white p-2.5 shadow-lg">
                                <Play className="ml-0.5 size-5 fill-indigo-500 text-indigo-500" />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <img
                            src={`https://picsum.photos/200/200?random=${video.id}`}
                            alt={video.title || `Video ${video.id}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="rounded-full bg-white p-2.5 shadow-lg">
                                <Play className="ml-0.5 size-5 fill-indigo-500 text-indigo-500" />
                            </div>
                        </div>
                    </>
                )}
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
                            <span className="flex items-center gap-1.5 rounded-full border border-emerald-100/50 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                                <CheckCircle2 className="size-3.5" />
                                READY
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={video.video_path || '#'}
                            target="_blank"
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-white hover:shadow-sm"
                        >
                            <Eye className="size-4 text-slate-500" />
                            Preview
                        </a>
                        <a
                            href={video.video_path || '#'}
                            download
                            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/10 transition-all hover:bg-indigo-600"
                        >
                            <Download className="size-4" />
                            Download
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
