import { Head } from '@inertiajs/react';

export default function VideoCreator() {
    return (
        <>
            <Head title="ShortsGen - Video Creator" />
            <style>{`
                @keyframes rotate-border {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -400; }
                }
            `}</style>
            
            <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 antialiased">
                {/* Navigation */}
                <nav className="h-16 px-8 border-b border-slate-800/60 flex items-center justify-between backdrop-blur-xl bg-slate-900/40 sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#5555f6] text-2xl">movie_filter</span>
                            <span className="text-lg font-bold tracking-tight">Shorts<span className="text-[#5555f6]">Gen</span></span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <a className="text-sm font-medium text-slate-100" href="#">Editor</a>
                            <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">Projects</a>
                            <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">Assets</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-[#5555f6] to-[#ec4899]" />
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">New Creation</h1>
                            <p className="text-slate-500 text-sm">Transform your ideas into vertical magic</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-5 py-2 rounded-xl text-sm font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors">
                                Save Draft
                            </button>
                            <div className="relative">
                                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="gradient-btn" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#5555f6" />
                                            <stop offset="50%" stopColor="#ec4899" />
                                            <stop offset="100%" stopColor="#5555f6" />
                                        </linearGradient>
                                    </defs>
                                    <rect
                                        x="1" y="1"
                                        width="calc(100% - 2px)" height="calc(100% - 2px)"
                                        rx="12" ry="12"
                                        fill="none"
                                        stroke="url(#gradient-btn)"
                                        strokeWidth="2"
                                        strokeDasharray="100 300"
                                        style={{ animation: 'rotate-border 3s linear infinite' }}
                                    />
                                </svg>
                                <button className="relative bg-gradient-to-br from-[#5555f6] to-[#ec4899] px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-[#5555f6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">bolt</span>
                                    Generate Video
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/40 rounded-[2rem] p-8 flex flex-col lg:flex-row gap-12">
                        {/* Left Column - Form */}
                        <div className="flex-1 flex flex-col gap-10">
                            {/* Media Assets */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">image</span>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Media Assets</h3>
                                </div>
                                <div className="group relative bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center transition-all hover:border-[#5555f6]/50 hover:bg-slate-900/60 cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-[#5555f6]/10 transition-colors">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-[#5555f6] transition-colors">add</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-300">Drop images here or browse</p>
                                    <p className="text-[11px] text-slate-500 mt-1">Up to 10 images • 9:16 recommended</p>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-16 h-24 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-slate-700">image</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Script */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">description</span>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Script</h3>
                                </div>
                                <textarea 
                                    className="w-full h-32 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#5555f6]/50 resize-none"
                                    placeholder="Write your script or let AI generate one..."
                                />
                                <button className="text-sm text-[#5555f6] hover:text-[#ec4899] transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                                    Generate with AI
                                </button>
                            </section>

                            {/* Voice & Music */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">graphic_eq</span>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Voice & Music</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500">Voice</label>
                                        <select className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5555f6]/50">
                                            <option>Natural Female</option>
                                            <option>Natural Male</option>
                                            <option>Energetic</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-slate-500">Background Music</label>
                                        <select className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5555f6]/50">
                                            <option>Upbeat</option>
                                            <option>Chill</option>
                                            <option>Epic</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Style */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">palette</span>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Style</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Minimal', 'Bold', 'Cinematic'].map((style) => (
                                        <button key={style} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-sm font-medium text-slate-300 hover:border-[#5555f6] hover:text-white transition-all">
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Preview */}
                        <div className="lg:w-80 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-xl">visibility</span>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Preview</h3>
                            </div>
                            <div className="relative">
                                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="gradient-preview" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#5555f6" />
                                            <stop offset="50%" stopColor="#ec4899" />
                                            <stop offset="100%" stopColor="#5555f6" />
                                        </linearGradient>
                                    </defs>
                                    <rect
                                        x="2" y="2"
                                        width="calc(100% - 4px)" height="calc(100% - 4px)"
                                        rx="24" ry="24"
                                        fill="none"
                                        stroke="url(#gradient-preview)"
                                        strokeWidth="2"
                                        strokeDasharray="150 350"
                                        style={{ animation: 'rotate-border 4s linear infinite' }}
                                    />
                                </svg>
                                <div className="relative aspect-[9/16] bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_40px_-10px_rgba(85,85,246,0.2)] flex items-center justify-center">
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                                            <span className="material-symbols-outlined text-slate-600 text-3xl">play_circle</span>
                                        </div>
                                        <p className="text-sm text-slate-500">Preview will appear here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
