import { Wand2, Upload, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

type Props = {
    onNext: () => void;
    onBack: () => void;
};

export function VideoScriptStep({ onNext, onBack }: Props) {
    const [script, setScript] = useState('');

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-125 flex flex-col">
            <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Video Script</h3>
                            <p className="text-sm text-slate-500">Write your complete video script</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 text-xs font-bold text-indigo-500 bg-indigo-500/5 rounded-lg hover:bg-indigo-500/10 transition-colors flex items-center gap-2">
                            <Wand2 className="w-4 h-4" />
                            AI Rewrite
                        </button>
                        <button className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Import .txt
                        </button>
                    </div>
                </div>

                <textarea 
                    className="w-full flex-1 bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none outline-none" 
                    placeholder="Write your complete video script here..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                />
            </div>

            <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
                <button onClick={onBack} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-2 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="flex items-center gap-6">
                    <span className="text-xs text-slate-400 font-medium">Total script length: {script.length} / 2000 characters</span>
                    <button onClick={onNext} className="px-8 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2">
                        Generation Settings
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
