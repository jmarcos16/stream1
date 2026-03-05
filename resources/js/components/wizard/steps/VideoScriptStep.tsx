import {
    Wand2,
    Upload,
    FileText,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Video } from '@/types/video';
import { router } from '@inertiajs/react';
import { update } from '@/routes/video/script';
import debounce from 'lodash.debounce';

type Props = {
    video: Video;
    onNext: () => void;
    onBack: () => void;
};

export function VideoScriptStep({ video, onNext, onBack }: Props) {
    const [script, setScript] = useState(video.script || '');

    const saveScript = useCallback(
        debounce((value: string) => {
            router.patch(update({ video: video.id }), { script: value }, { preserveScroll: true });
        }, 2000),
        [video.id]
    );

    const handleChange = (value: string) => {
        setScript(value);
        saveScript(value);
    };

    const handleBlur = () => {
        saveScript.cancel();
        router.patch(update({ video: video.id }), { script }, { preserveScroll: true });
    };

    return (
        <div className="flex min-h-125 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-1 flex-col p-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Video Script
                            </h3>
                            <p className="text-sm text-slate-500">
                                Write your complete video script
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 rounded-lg bg-indigo-500/5 px-4 py-2 text-xs font-bold text-indigo-500 transition-colors hover:bg-indigo-500/10">
                            <Wand2 className="h-4 w-4" />
                            AI Rewrite
                        </button>
                        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50">
                            <Upload className="h-4 w-4" />
                            Import .txt
                        </button>
                    </div>
                </div>

                <textarea
                    className="w-full flex-1 resize-none rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Write your complete video script here..."
                    value={script}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Back
                </button>
                <div className="flex items-center gap-6">
                    <span className="text-xs font-medium text-slate-400">
                        Total script length: {script.length} / 2000 characters
                    </span>
                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30"
                    >
                        Generation Settings
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
