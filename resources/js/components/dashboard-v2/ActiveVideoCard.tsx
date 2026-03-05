import { LoaderCircle } from 'lucide-react';
import type { Video } from '@/types/video';

type Props = {
    video: Video;
};

export function ActiveVideoCard({ video }: Props) {
    return (
        <div className="group shimmer-effect flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-500/40 hover:shadow-md md:flex-row md:items-center">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg md:size-20">
                <img
                    src={`https://picsum.photos/200/200?random=${video.id}`}
                    alt={video.title || `Video ${video.id}`}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20">
                    <LoaderCircle
                        className="size-6 animate-spin text-white"
                        style={{ animationDuration: '3s' }}
                    />
                </div>
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <h4 className="truncate text-base font-bold text-slate-900">
                            {video.title || `Untitled Project #${video.id}`}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                {video.status_label}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                            <span className="block text-sm font-bold text-indigo-500">
                                Processing
                            </span>
                            <span className="block text-[11px] font-medium text-slate-500">
                                Please wait...
                            </span>
                        </div>
                        <button className="rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white">
                            Cancel
                        </button>
                    </div>
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                        style={{ width: '50%' }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
