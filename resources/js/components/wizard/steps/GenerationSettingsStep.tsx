import { Link } from '@inertiajs/react';
import {
    Settings,
    Palette,
    ChevronUp,
    Film,
    Brush,
    Building2,
    Video,
    ChevronDown,
    Mic,
    Captions,
    Maximize2,
    ChevronLeft,
    Zap,
} from 'lucide-react';

type Props = {
    onBack: () => void;
};

export function GenerationSettingsStep({ onBack }: Props) {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex-1 p-8">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                            <Settings className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Generation Settings
                            </h3>
                            <p className="text-sm text-slate-500">
                                Fine-tune your video output parameters
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Visual Styles */}
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <span className="flex size-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                                    1
                                </span>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <Palette className="h-4 w-4" />
                                    Visual Styles
                                </label>
                            </div>
                            <ChevronUp className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="space-y-6 p-6">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <button className="flex flex-col items-center gap-3 rounded-xl border-2 border-indigo-500 bg-indigo-500/5 p-4 transition-all">
                                    <Film className="h-7 w-7 text-indigo-500" />
                                    <span className="text-[10px] font-bold tracking-tight text-indigo-500 uppercase">
                                        Cinematic
                                    </span>
                                </button>
                                <button className="flex flex-col items-center gap-3 rounded-xl border-2 border-slate-100 p-4 transition-all hover:border-slate-200">
                                    <Brush className="h-7 w-7 text-slate-400" />
                                    <span className="text-[10px] font-bold tracking-tight text-slate-500 uppercase">
                                        Artistic
                                    </span>
                                </button>
                                <button className="flex flex-col items-center gap-3 rounded-xl border-2 border-slate-100 p-4 transition-all hover:border-slate-200">
                                    <Building2 className="h-7 w-7 text-slate-400" />
                                    <span className="text-[10px] font-bold tracking-tight text-slate-500 uppercase">
                                        Corporate
                                    </span>
                                </button>
                                <button className="flex flex-col items-center gap-3 rounded-xl border-2 border-slate-100 p-4 transition-all hover:border-slate-200">
                                    <Video className="h-7 w-7 text-slate-400" />
                                    <span className="text-[10px] font-bold tracking-tight text-slate-500 uppercase">
                                        Vlog
                                    </span>
                                </button>
                            </div>
                            <select className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 pr-4 text-sm text-slate-700 focus:ring-indigo-500/20">
                                <option>Modern Corporate</option>
                                <option>Vlog Style</option>
                                <option>Educational</option>
                                <option>Vintage Film</option>
                            </select>
                        </div>
                    </div>

                    {/* Audio & Voiceover */}
                    <div className="overflow-hidden rounded-xl border border-slate-100 opacity-80">
                        <div className="flex cursor-pointer items-center justify-between border-b border-slate-100 bg-white px-6 py-4 hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                    2
                                </span>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                    <Mic className="h-4 w-4" />
                                    Audio &amp; Voiceover
                                </label>
                            </div>
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    {/* Subtitles & Captions */}
                    <div className="overflow-hidden rounded-xl border border-slate-100 opacity-80">
                        <div className="flex cursor-pointer items-center justify-between border-b border-slate-100 bg-white px-6 py-4 hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                    3
                                </span>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                    <Captions className="h-4 w-4" />
                                    Subtitles &amp; Captions
                                </label>
                            </div>
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    {/* Output Config */}
                    <div className="overflow-hidden rounded-xl border border-slate-100 opacity-80">
                        <div className="flex cursor-pointer items-center justify-between border-b border-slate-100 bg-white px-6 py-4 hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                    4
                                </span>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                    <Maximize2 className="h-4 w-4" />
                                    Output Configuration
                                </label>
                            </div>
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Video Script
                </button>
                <Link
                    href="#"
                    className="flex items-center gap-2 rounded-xl bg-indigo-500 px-10 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/40"
                >
                    Generate Video
                    <Zap className="h-5 w-5" />
                </Link>
            </div>
        </div>
    );
}
