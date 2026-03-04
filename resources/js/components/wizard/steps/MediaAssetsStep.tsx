import { v2 } from '@/routes/video-creator';
import { Link } from '@inertiajs/react';

type Props = {
    onNext: () => void;
};

export function MediaAssetsStep({ onNext }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <span className="material-symbols-outlined">upload_file</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Media Assets</h3>
                            <p className="text-sm text-slate-500">Upload your visual content to get started</p>
                        </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">Max 500MB • JPG, PNG, MP4</span>
                </div>
                
                <div className="relative group cursor-pointer h-80">
                    <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" multiple type="file" />
                    <div className="h-full border-2 border-dashed border-slate-200 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all rounded-2xl flex flex-col items-center justify-center text-center px-6">
                        <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-white transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-500 text-4xl">add_photo_alternate</span>
                        </div>
                        <p className="text-base font-semibold text-slate-700">Drag and drop images or videos here</p>
                        <p className="text-sm text-slate-400 mt-2 max-w-sm">Bring your own media or select from our stock library in the next step</p>
                        <button className="mt-8 px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                            Browse Files
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
                <Link href={v2()} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    Cancel
                </Link>
                <button onClick={onNext} className="px-8 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2">
                    Next: Video Script
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
            </div>
        </div>
    );
}
