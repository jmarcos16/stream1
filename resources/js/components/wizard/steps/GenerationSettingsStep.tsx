import { Link } from '@inertiajs/react';
import { Settings, Palette, ChevronUp, Film, Brush, Building2, Video, ChevronDown, Mic, Captions, Maximize2, ChevronLeft, Zap } from 'lucide-react';

type Props = {
    onBack: () => void;
};

export function GenerationSettingsStep({ onBack }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Generation Settings</h3>
                            <p className="text-sm text-slate-500">Fine-tune your video output parameters</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Visual Styles */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-200">
                            <div className="flex items-center gap-3">
                                <span className="size-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <Palette className="w-4 h-4" />
                                    Visual Styles
                                </label>
                            </div>
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <button className="flex flex-col items-center gap-3 p-4 border-2 border-indigo-500 bg-indigo-500/5 rounded-xl transition-all">
                                    <Film className="w-7 h-7 text-indigo-500" />
                                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">Cinematic</span>
                                </button>
                                <button className="flex flex-col items-center gap-3 p-4 border-2 border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                                    <Brush className="w-7 h-7 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Artistic</span>
                                </button>
                                <button className="flex flex-col items-center gap-3 p-4 border-2 border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                                    <Building2 className="w-7 h-7 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Corporate</span>
                                </button>
                                <button className="flex flex-col items-center gap-3 p-4 border-2 border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                                    <Video className="w-7 h-7 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Vlog</span>
                                </button>
                            </div>
                            <select className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm text-slate-700 py-3 pr-4 focus:ring-indigo-500/20">
                                <option>Modern Corporate</option>
                                <option>Vlog Style</option>
                                <option>Educational</option>
                                <option>Vintage Film</option>
                            </select>
                        </div>
                    </div>

                    {/* Audio & Voiceover */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden opacity-80">
                        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 cursor-pointer hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <span className="size-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">2</span>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                    <Mic className="w-4 h-4" />
                                    Audio &amp; Voiceover
                                </label>
                            </div>
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>

                    {/* Subtitles & Captions */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden opacity-80">
                        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 cursor-pointer hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <span className="size-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">3</span>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                    <Captions className="w-4 h-4" />
                                    Subtitles &amp; Captions
                                </label>
                            </div>
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>

                    {/* Output Config */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden opacity-80">
                        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 cursor-pointer hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <span className="size-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">4</span>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                    <Maximize2 className="w-4 h-4" />
                                    Output Configuration
                                </label>
                            </div>
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
                <button onClick={onBack} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" />
                    Video Script
                </button>
                <Link href="#" className="px-10 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
                    Generate Video
                    <Zap className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
