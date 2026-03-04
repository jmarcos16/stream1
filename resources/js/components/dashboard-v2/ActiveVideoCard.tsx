import { LoaderCircle } from 'lucide-react';
import type { Video } from '@/types/video';

type Props = {
    video: Video;
};

export function ActiveVideoCard({ video }: Props) {
    return (
        <div className="shimmer-effect group flex flex-col md:flex-row md:items-center gap-5 bg-white border border-slate-200 p-5 rounded-xl hover:border-indigo-500/40 transition-all hover:shadow-md">
            <div className="relative size-24 md:size-20 rounded-lg overflow-hidden shrink-0">
                <img 
                    src={`https://picsum.photos/200/200?random=${video.id}`} 
                    alt={video.title || `Video ${video.id}`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                    <LoaderCircle className="text-white size-6 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-base font-bold text-slate-900 truncate">{video.title || `Untitled Project #${video.id}`}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{video.status_label}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <span className="block text-sm font-bold text-indigo-500">Processing</span>
                            <span className="block text-[11px] text-slate-500 font-medium">Please wait...</span>
                        </div>
                        <button className="px-4 py-2 text-xs font-bold text-red-500 border border-red-100 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all">Cancel</button>
                    </div>
                </div>
                <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: '50%' }}></div>
                </div>
            </div>
        </div>
    );
}
