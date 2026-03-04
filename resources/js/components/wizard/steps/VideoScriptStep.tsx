type Props = {
    onNext: () => void;
    onBack: () => void;
};

export function VideoScriptStep({ onNext, onBack }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Video Script</h3>
                            <p className="text-sm text-slate-500">Break down your story into manageable scenes</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 text-xs font-bold text-indigo-500 bg-indigo-500/5 rounded-lg hover:bg-indigo-500/10 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                            AI Rewrite
                        </button>
                        <button className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">file_upload</span>
                            Import .txt
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="group relative bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-white transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-6 bg-slate-900 text-white rounded text-[10px] font-bold flex items-center justify-center">SCENE 1</div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Introduction</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                        <textarea 
                            className="w-full bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none outline-none min-h-[80px]" 
                            placeholder="Introduce the main topic and capture attention..."
                            defaultValue="Welcome to the future of video creation. In this short guide, we'll explore how VidGen AI transforms your ideas into professional content in seconds."
                        />
                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-indigo-500 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">image</span>
                                    Visual Prompt
                                </button>
                                <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-indigo-500 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">mic</span>
                                    Voice: Male Natural
                                </button>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">148 characters</span>
                        </div>
                    </div>

                    <div className="group relative bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-white transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-6 bg-slate-900 text-white rounded text-[10px] font-bold flex items-center justify-center">SCENE 2</div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Features</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                        <textarea 
                            className="w-full bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none outline-none min-h-[80px]" 
                            placeholder="Explain the key benefits or details..."
                        />
                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-indigo-500 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">image</span>
                                    Visual Prompt
                                </button>
                                <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-indigo-500 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">mic</span>
                                    Voice: Default
                                </button>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">0 characters</span>
                        </div>
                    </div>

                    <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 font-bold text-sm">
                        <span className="material-symbols-outlined">add_circle</span>
                        Add New Scene Block
                    </button>
                </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
                <button onClick={onBack} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    Back
                </button>
                <div className="flex items-center gap-6">
                    <span className="text-xs text-slate-400 font-medium">Total script length: 148 / 2000 characters</span>
                    <button onClick={onNext} className="px-8 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2">
                        Next: Generation Settings
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
