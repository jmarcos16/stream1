import { Play, CheckCircle2, Eye, Download } from 'lucide-react';
import type { Video } from '@/types/video';

type Props = {
    video: Video;
};

export function CompletedVideoCard({ video }: Props) {
    return (
        <div className="group flex items-center gap-5 bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-500/20 hover:bg-slate-50/50 transition-all">
            <div className="relative size-20 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100">
                <video className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={video.video_path || ''}></video>
                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white rounded-full p-2.5 shadow-lg">
                        <Play className="size-5 text-indigo-500 fill-indigo-500 ml-0.5" />
                    </div>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-base font-bold text-slate-900 truncate">{video.title || `Untitled Project #${video.id}`}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">{new Date(video.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                                <CheckCircle2 className="size-3.5" />
                                READY
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={video.video_path || '#'} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 border border-slate-200 hover:bg-white hover:shadow-sm transition-all">
                            <Eye className="size-4 text-slate-500" />
                            Preview
                        </a>
                        <a href={video.video_path || '#'} download className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-500 text-white hover:bg-indigo-600 shadow-md shadow-indigo-500/10 transition-all">
                            <Download className="size-4" />
                            Download
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
