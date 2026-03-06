import { Head, useForm } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';
import { generate } from '@/routes/video';
import { store as uploadMedia } from '@/routes/temp-media';
import { destroy as deleteMedia } from '@/routes/temp-media';
import axios from 'axios';

type UploadedImage = {
    path: string;
    url: string;
    name: string;
    uploading?: boolean;
};

export default function VideoCreator() {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        title: '',
        script: '',
        aiVoiceover: true,
        autoSubtitles: true,
        images: [] as string[],
    });

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (!fileArray.length) return;

        const placeholders: UploadedImage[] = fileArray.map(f => ({
            path: '', url: '', name: f.name, uploading: true,
        }));
        setImages(prev => [...prev, ...placeholders]);
        const startIndex = images.length;

        for (let i = 0; i < fileArray.length; i++) {
            const formData = new FormData();
            formData.append('file', fileArray[i]);

            try {
                const { data } = await axios.post(uploadMedia().url, formData);
                setImages(prev => {
                    const updated = [...prev];
                    updated[startIndex + i] = { path: data.path, url: data.url, name: data.name };
                    return updated;
                });
            } catch {
                setImages(prev => prev.filter((_, idx) => idx !== startIndex + i));
            }
        }
    }, [images.length]);

    const removeImage = async (index: number) => {
        const image = images[index];
        const filename = image.path.split('/').pop();
        if (filename) {
            axios.delete(deleteMedia(filename).url);
        }
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDragStart = (index: number) => setDragIndex(index);
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };
    const handleDrop = (index: number) => {
        if (dragIndex === null || dragIndex === index) return;
        setImages(prev => {
            const updated = [...prev];
            const [moved] = updated.splice(dragIndex, 1);
            updated.splice(index, 0, moved);
            return updated;
        });
        setDragIndex(null);
        setDragOverIndex(null);
    };
    const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

    const handleDropZone = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-[#5555f6]/50', 'bg-slate-900/60');
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    };

    const handleSubmit = () => {
        const validPaths = images.filter(img => !img.uploading).map(img => img.path);
        form.transform(data => ({ ...data, images: validPaths }));
        form.post(generate().url);
    };

    return (
        <>
            <Head title="ShortsGen - Video Creator" />
            <style>{`
                @keyframes rotate-border {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -400; }
                }
            `}</style>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files && handleFiles(e.target.files)}
            />

            <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 antialiased">
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

                <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <input
                                type="text"
                                value={form.data.title}
                                onChange={e => form.setData('title', e.target.value)}
                                className="text-2xl font-bold bg-transparent border-none outline-none placeholder:text-slate-600 w-full"
                                placeholder="Untitled Project"
                            />
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
                                    <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="12" ry="12" fill="none" stroke="url(#gradient-btn)" strokeWidth="2" strokeDasharray="100 300" style={{ animation: 'rotate-border 3s linear infinite' }} />
                                </svg>
                                <button
                                    onClick={handleSubmit}
                                    disabled={form.processing || images.some(i => i.uploading) || !images.length}
                                    className="relative bg-gradient-to-br from-[#5555f6] to-[#ec4899] px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-[#5555f6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    <span className="material-symbols-outlined text-lg">bolt</span>
                                    {form.processing ? 'Generating...' : 'Generate Video'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800/40 rounded-[2rem] p-8 flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 flex flex-col gap-10">
                            {/* Media Assets */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">image</span>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Media Assets</h3>
                                    {images.length > 0 && (
                                        <span className="text-xs text-slate-500 ml-auto">{images.length}/10 • Drag to reorder</span>
                                    )}
                                </div>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-[#5555f6]/50', 'bg-slate-900/60'); }}
                                    onDragLeave={e => e.currentTarget.classList.remove('border-[#5555f6]/50', 'bg-slate-900/60')}
                                    onDrop={handleDropZone}
                                    className="group relative bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center transition-all hover:border-[#5555f6]/50 hover:bg-slate-900/60 cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-[#5555f6]/10 transition-colors">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-[#5555f6] transition-colors">add</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-300">Drop images here or browse</p>
                                    <p className="text-[11px] text-slate-500 mt-1">Up to 10 images • 9:16 recommended</p>
                                </div>
                                {images.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {images.map((image, i) => (
                                            <div
                                                key={image.path || i}
                                                draggable={!image.uploading}
                                                onDragStart={() => handleDragStart(i)}
                                                onDragOver={e => handleDragOver(e, i)}
                                                onDrop={() => handleDrop(i)}
                                                onDragEnd={handleDragEnd}
                                                className={`relative w-16 h-24 rounded-lg border shrink-0 overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
                                                    dragOverIndex === i ? 'border-[#5555f6] scale-105' : 'border-slate-800'
                                                } ${dragIndex === i ? 'opacity-40' : ''}`}
                                            >
                                                {image.uploading ? (
                                                    <div className="w-full h-full bg-slate-900/60 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-slate-500 animate-spin text-sm">progress_activity</span>
                                                    </div>
                                                ) : (
                                                    <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                                                )}
                                                <span className="absolute top-0.5 left-1 text-[9px] font-bold text-white drop-shadow">{i + 1}</span>
                                                {!image.uploading && (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); removeImage(i); }}
                                                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-white text-[10px]">close</span>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Script */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">description</span>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Script</h3>
                                </div>
                                <textarea
                                    value={form.data.script}
                                    onChange={e => form.setData('script', e.target.value)}
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
                                    <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="24" ry="24" fill="none" stroke="url(#gradient-preview)" strokeWidth="2" strokeDasharray="150 350" style={{ animation: 'rotate-border 4s linear infinite' }} />
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
